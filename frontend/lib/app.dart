import 'package:flutter/material.dart';

import 'services/api_service.dart';
import 'screens/dashboard_screen.dart';

class JobAssistantApp extends StatelessWidget {
  const JobAssistantApp({
    super.key,
    this.apiService,
    this.autoLoad = true,
  });

  final ApiService? apiService;
  final bool autoLoad;

  @override
  Widget build(BuildContext context) {
    const surface = Color(0xFFF4EFE8);
    const ink = Color(0xFF1C2735);
    const accent = Color(0xFFCE5A39);

    return MaterialApp(
      title: 'Job Assistant',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: accent,
          primary: accent,
          secondary: const Color(0xFF0F766E),
          surface: surface,
        ),
        scaffoldBackgroundColor: surface,
        textTheme: ThemeData.light().textTheme.apply(
              bodyColor: ink,
              displayColor: ink,
            ),
        useMaterial3: true,
      ),
      home: DashboardScreen(
        apiService: apiService ?? ApiService(),
        autoLoad: autoLoad,
      ),
    );
  }
}
