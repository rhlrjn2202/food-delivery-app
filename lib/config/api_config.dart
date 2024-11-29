class ApiConfig {
  static const String baseUrl = 'http://your-backend-url/api';
  static const int timeout = 30000;
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}