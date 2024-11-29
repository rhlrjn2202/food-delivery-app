import 'package:flutter/material.dart';
import 'package:food_delivery/models/category.dart';
import 'package:food_delivery/screens/home_screen.dart';
import 'package:food_delivery/screens/auth_screen.dart';
import 'package:food_delivery/screens/cart_screen.dart';
import 'package:food_delivery/screens/category_screen.dart';
import 'package:food_delivery/screens/order_success_screen.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      
      case '/auth':
        return MaterialPageRoute(builder: (_) => const AuthScreen());
      
      case '/cart':
        return MaterialPageRoute(builder: (_) => const CartScreen());
      
      case '/category':
        final category = settings.arguments as Category;
        return MaterialPageRoute(
          builder: (_) => CategoryScreen(category: category),
        );
      
      case '/order-success':
        return MaterialPageRoute(
          builder: (_) => const OrderSuccessScreen(),
        );
      
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}