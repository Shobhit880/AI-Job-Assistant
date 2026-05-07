import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import '../models/job_model.dart';
import '../services/api_service.dart';
import '../widgets/job_card.dart';
import '../widgets/metric_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({
    super.key,
    required this.apiService,
    this.autoLoad = true,
  });

  final ApiService apiService;
  final bool autoLoad;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _loading = true;
  bool _generatingPack = false;
  List<JobModel> _jobs = const [];
  Map<String, dynamic> _dashboard = const {};
  String _resumeStatus = 'No file selected';

  @override
  void initState() {
    super.initState();
    if (widget.autoLoad) {
      _loadData();
    } else {
      _loading = false;
    }
  }

  Future<void> _loadData() async {
    try {
      final results = await Future.wait([
        widget.apiService.fetchRecommendations(),
        widget.apiService.fetchDashboard(),
      ]);

      if (!mounted) return;

      setState(() {
        _jobs = results[0] as List<JobModel>;
        _dashboard = results[1] as Map<String, dynamic>;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _pickResume() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
      withData: true,
    );

    if (!mounted || result == null || result.files.isEmpty) return;

    final file = result.files.single;

    setState(() {
      _resumeStatus = 'Uploading: ${file.name}';
      _loading = true;
    });

    try {
      final uploadWorked = await widget.apiService.uploadResume(
        filePath: file.path,
        bytes: file.bytes,
        fileName: file.name,
      );

      if (!uploadWorked) {
        throw Exception('Upload failed');
      }

      final results = await Future.wait([
        widget.apiService.fetchRecommendations(),
        widget.apiService.fetchDashboard(),
      ]);

      if (!mounted) return;

      setState(() {
        _jobs = results[0] as List<JobModel>;
        _dashboard = results[1] as Map<String, dynamic>;
        _resumeStatus = 'Uploaded: ${file.name}';
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _resumeStatus = 'Upload failed';
        _loading = false;
      });

      debugPrint('Upload error: $e');
    }
  }

  Future<void> _generateApplicationPack(JobModel job) async {
    setState(() {
      _generatingPack = true;
    });

    final response = await widget.apiService.generateApplicationPack(job.id);

    if (!mounted) return;

    setState(() {
      _generatingPack = false;
    });

    if (response == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not generate application pack.')),
      );
      return;
    }

    final generated =
        response['generated'] as Map<String, dynamic>? ?? const {};
    final hrAnswers = (generated['hrAnswers'] as List<dynamic>? ?? const [])
        .map((item) => item.toString())
        .join('\n\n');

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.fromLTRB(
            20,
            12,
            20,
            20 + MediaQuery.of(context).viewInsets.bottom,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Application Pack',
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Text(
                  '${job.title} at ${job.company}',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 18),
                Text(
                  'Resume Summary',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Text(generated['resumeSummary']?.toString() ??
                    'No summary generated.'),
                const SizedBox(height: 18),
                Text(
                  'Cover Letter',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Text(generated['coverLetter']?.toString() ??
                    'No cover letter generated.'),
                const SizedBox(height: 18),
                Text(
                  'HR Answers',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Text(
                    hrAnswers.isEmpty ? 'No HR answers generated.' : hrAnswers),
              ],
            ),
          ),
        );
      },
    );

    await _loadData();
  }

  @override
  Widget build(BuildContext context) {
    final recommended = _jobs.length.toString();
    final saved =
        ((_dashboard['recommendedJobs'] as List<dynamic>?)?.length ?? 0)
            .toString();
    final applied =
        ((_dashboard['appliedJobs'] as List<dynamic>?)?.length ?? 0).toString();

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1C2735), Color(0xFFCE5A39)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(32),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AI Job Application Assistant',
                      style:
                          Theme.of(context).textTheme.headlineSmall?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                              ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Upload a resume, review matched jobs, generate tailored application content, and use safe-mode autofill.',
                      style: TextStyle(color: Colors.white70),
                    ),
                    const SizedBox(height: 20),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        OutlinedButton(
                          onPressed: _loading ? null : _pickResume,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.white70),
                          ),
                          child: const Text('Upload Resume PDF'),
                        ),
                        Chip(
                          label: Text(_resumeStatus),
                          backgroundColor: const Color(0x22FFFFFF),
                          labelStyle: const TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              GridView.count(
                crossAxisCount: MediaQuery.of(context).size.width > 900 ? 3 : 1,
                childAspectRatio: 2.7,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: [
                  MetricCard(
                      title: 'Recommended Jobs',
                      value: recommended,
                      color: const Color(0xFFCE5A39)),
                  MetricCard(
                      title: 'Saved Jobs',
                      value: saved,
                      color: const Color(0xFF0F766E)),
                  MetricCard(
                      title: 'Applied Jobs',
                      value: applied,
                      color: const Color(0xFF3C4C65)),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Best Matches',
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ),
                  if (_generatingPack)
                    const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator()),
                ],
              ),
              const SizedBox(height: 12),
              if (_loading)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(),
                  ),
                )
              else if (_jobs.isEmpty)
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Text(
                      'No recommendations yet. Upload a resume to begin.'),
                )
              else
                ..._jobs.map(
                  (job) => Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: JobCard(
                      job: job,
                      onGenerate: _generatingPack
                          ? () {}
                          : () => _generateApplicationPack(job),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
