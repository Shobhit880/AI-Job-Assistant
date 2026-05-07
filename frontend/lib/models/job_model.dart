class JobModel {
  const JobModel({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.matchScore,
    required this.description,
    required this.skills,
  });

  final String id;
  final String title;
  final String company;
  final String location;
  final int matchScore;
  final String description;
  final List<String> skills;

  factory JobModel.fromJson(Map<String, dynamic> json) {
    return JobModel(
      id: json['_id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      company: json['company']?.toString() ?? '',
      location: json['location']?.toString() ?? '',
      matchScore: (json['matchScore'] as num?)?.toInt() ?? 0,
      description: json['description']?.toString() ?? '',
      skills: (json['skills'] as List<dynamic>? ?? []).map((item) => item.toString()).toList(),
    );
  }
}
