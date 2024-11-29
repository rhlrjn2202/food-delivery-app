import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/cart_provider.dart';

class FeaturedItems extends StatelessWidget {
  const FeaturedItems({super.key});

  @override
  Widget build(BuildContext context) {
    final featuredItems = [
      {
        'id': '1',
        'name': 'Butter Chicken',
        'price': 299.0,
        'description': 'Creamy, rich and mildly spiced chicken curry',
      },
      {
        'id': '2',
        'name': 'Paneer Tikka',
        'price': 249.0,
        'description': 'Grilled cottage cheese with spices',
      },
      {
        'id': '3',
        'name': 'Biryani',
        'price': 349.0,
        'description': 'Aromatic rice dish with spices',
      },
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: featuredItems.length,
      itemBuilder: (ctx, i) => Card(
        margin: const EdgeInsets.only(bottom: 16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.food_bank, size: 50),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      featuredItems[i]['name'] as String,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      featuredItems[i]['description'] as String,
                      style: TextStyle(
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '₹${featuredItems[i]['price']}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            context.read<CartProvider>().addItem(
                              featuredItems[i]['id'] as String,
                              featuredItems[i]['name'] as String,
                              featuredItems[i]['price'] as double,
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Added to cart!'),
                                duration: Duration(seconds: 1),
                              ),
                            );
                          },
                          child: const Text('Add to Cart'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}