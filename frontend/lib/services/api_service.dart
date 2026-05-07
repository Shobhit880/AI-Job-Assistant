import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../models/job_model.dart';

class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:5002/api', // ✅ correct backend port
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );
  }

  Future<bool> uploadResume({
    String? filePath,
    Uint8List? bytes,
    required String fileName,
  }) async {
    try {
      final resumeFile = bytes != null
          ? MultipartFile.fromBytes(
              bytes,
              filename: fileName,
            )
          : await MultipartFile.fromFile(
              filePath!,
              filename: fileName,
            );

      final formData = FormData.fromMap({
        'resume': resumeFile,
        'userId': 'demo-user',
      });

      await _dio.post(
        '/resumes/parse',
        data: formData,
      );

      return true;
    } catch (e) {
      debugPrint('Upload error: $e');
      return false;
    }
  }

  Future<List<JobModel>> fetchRecommendations() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/jobs/recommendations',
        queryParameters: {'userId': 'demo-user'},
      );

      final jobs = (response.data?['jobs'] as List<dynamic>? ?? [])
          .map((item) => JobModel.fromJson(item as Map<String, dynamic>))
          .toList();

      return jobs;
    } catch (e) {
      debugPrint('Error fetching recommendations: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>> fetchDashboard() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/dashboard',
        queryParameters: {'userId': 'demo-user'},
      );

      return response.data ?? <String, dynamic>{};
    } catch (e) {
      debugPrint('Error fetching dashboard: $e');
      return {};
    }
  }

  Future<Map<String, dynamic>?> generateApplicationPack(String jobId) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/content/generate',
        data: {
          'jobId': jobId,
          'userId': 'demo-user',
          'status': 'saved',
        },
      );

      return response.data;
    } catch (e) {
      debugPrint('Error generating application pack: $e');
      return null;
    }
  }
}
