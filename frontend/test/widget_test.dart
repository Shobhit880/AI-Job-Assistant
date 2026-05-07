import 'package:flutter_test/flutter_test.dart';

import 'package:job_application_assistant/app.dart';

void main() {
  testWidgets('renders dashboard title', (tester) async {
    await tester.pumpWidget(const JobAssistantApp(autoLoad: false));
    expect(find.text('AI Job Application Assistant'), findsOneWidget);
  });
}
