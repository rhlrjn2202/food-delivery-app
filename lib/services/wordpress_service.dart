import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences.dart';

class WordPressService {
  // Replace with your WordPress site URL
  static const String baseUrl = 'https://your-wordpress-site.com/wp-json';
  static const String customApi = '$baseUrl/food-delivery/v1';
  static const String authEndpoint = '$baseUrl/jwt-auth/v1/token';

  String? _authToken;

  Future<bool> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse(authEndpoint),
        body: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _authToken = data['token'];
        // Store token for later use
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', _authToken!);
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  Future<List<dynamic>> getFeaturedItems() async {
    try {
      final response = await http.get(
        Uri.parse('$customApi/featured-items'),
        headers: _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return [];
    } catch (e) {
      print('Error fetching featured items: $e');
      return [];
    }
  }

  Future<List<dynamic>> getCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$customApi/categories'),
        headers: _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return [];
    } catch (e) {
      print('Error fetching categories: $e');
      return [];
    }
  }

  Future<bool> submitOrder(Map<String, dynamic> orderData) async {
    try {
      final response = await http.post(
        Uri.parse('$customApi/orders'),
        headers: _getHeaders(),
        body: json.encode(orderData),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error submitting order: $e');
      return false;
    }
  }

  Map<String, String> _getHeaders() {
    return {
      'Content-Type': 'application/json',
      if (_authToken != null) 'Authorization': 'Bearer $_authToken',
    };
  }
}