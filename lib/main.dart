import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:food_delivery/providers/auth_provider.dart';
import 'package:food_delivery/providers/cart_provider.dart';
import 'package:food_delivery/config/theme.dart';
import 'package:food_delivery/screens/splash_screen.dart';
import 'package:food_delivery/navigation/app_router.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: MaterialApp(
        title: 'Food Delivery',
        theme: appTheme,
        onGenerateRoute: AppRouter.generateRoute,
        home: const SplashScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}