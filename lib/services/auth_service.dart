import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:food_delivery/config/api_config.dart';
import 'package:food_delivery/models/auth_response.dart';

class AuthService {
  final http.Client _client = http.Client();

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: ApiConfig.headers,
        body: json.encode({
          'email': email,
          'password': password,
        }),
      ).timeout(const Duration(milliseconds: ApiConfig.timeout));

      if (response.statusCode == 200) {
        return AuthResponse.fromJson(json.decode(response.body));
      }
      throw Exception('Invalid credentials');
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  Future<AuthResponse> signup(String name, String email, String password) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/signup'),
        headers: ApiConfig.headers,
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
        }),
      ).timeout(const Duration(milliseconds: ApiConfig.timeout));

      if (response.statusCode == 201) {
        return AuthResponse.fromJson(json.decode(response.body));
      }
      throw Exception('Failed to create account');
    } catch (e) {
      throw Exception('Signup failed: $e');
    }
  }
}