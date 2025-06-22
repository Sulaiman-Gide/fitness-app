-- Add descriptions column to workout_templates table
ALTER TABLE workout_templates ADD COLUMN description TEXT;

-- Update workout templates with real descriptions
UPDATE workout_templates SET description = 'Transform your body with this comprehensive full-body strength workout. This session targets all major muscle groups through compound movements and isolation exercises, helping you build lean muscle mass and improve overall strength. Perfect for intermediate to advanced fitness enthusiasts looking to challenge themselves and see real results.' WHERE name = 'Full Body Strength';

UPDATE workout_templates SET description = 'Get your heart pumping with this high-energy cardio session designed to burn calories and boost your endurance. This workout combines running intervals, jumping exercises, and dynamic movements to maximize fat burn while keeping your metabolism elevated for hours after your session. Ideal for anyone looking to improve cardiovascular health and shed those extra pounds.' WHERE name = 'Cardio Blast';

UPDATE workout_templates SET description = 'Experience the ultimate fat-burning workout with this intense HIIT session. High-Intensity Interval Training alternates between maximum effort bursts and recovery periods, creating an afterburn effect that continues to burn calories long after your workout. This session will challenge your limits and push you to new levels of fitness performance.' WHERE name = 'HIIT Fat Burner';

UPDATE workout_templates SET description = 'Focus on building a strong, sculpted upper body with this targeted workout. This session emphasizes chest, back, shoulders, and arms through a variety of pushing and pulling movements. Whether you''re looking to build muscle mass or tone your upper body, this workout provides the perfect balance of strength and definition exercises.' WHERE name = 'Upper Body Power';

UPDATE workout_templates SET description = 'Strengthen your core and lower body with this dynamic leg and core focused session. This workout targets your glutes, quads, hamstrings, and core muscles through functional movements that improve balance, stability, and overall athletic performance. Perfect for building a strong foundation and improving your posture.' WHERE name = 'Legs & Core';

UPDATE workout_templates SET description = 'Find your inner peace and improve flexibility with this calming yoga flow session. This gentle yet effective workout combines stretching, breathing exercises, and mindful movement to reduce stress, increase flexibility, and promote mental clarity. Ideal for recovery days or anyone looking to improve their mind-body connection.' WHERE name = 'Yoga Flow';

UPDATE workout_templates SET description = 'Build explosive power and athletic performance with this plyometric-focused workout. This session incorporates jumping, bounding, and dynamic movements that improve your vertical leap, sprint speed, and overall athletic ability. Perfect for athletes and fitness enthusiasts looking to enhance their performance in sports and daily activities.' WHERE name = 'Plyometric Power';

UPDATE workout_templates SET description = 'Sculpt and tone your entire body with this bodyweight-focused workout. No equipment needed! This session uses your own body weight to build strength, improve muscle tone, and enhance functional fitness. Perfect for home workouts or when you''re traveling and want to maintain your fitness routine.' WHERE name = 'Bodyweight Sculpt';

UPDATE workout_templates SET description = 'Target your core muscles with this intensive ab and core strengthening session. This workout goes beyond basic crunches to include functional core movements that improve stability, balance, and overall strength. You''ll work your entire core including rectus abdominis, obliques, and deep stabilizing muscles.' WHERE name = 'Core Crusher';

UPDATE workout_templates SET description = 'Improve your flexibility and mobility with this comprehensive stretching session. This workout focuses on increasing your range of motion, reducing muscle tension, and preventing injuries through dynamic and static stretching techniques. Perfect for recovery days or as a warm-up before more intense workouts.' WHERE name = 'Flexibility Flow';

UPDATE workout_templates SET description = 'Build strength and endurance with this circuit training session. This workout combines strength exercises with cardio intervals to create a comprehensive full-body workout that burns calories and builds muscle simultaneously. The circuit format keeps your heart rate elevated while challenging your muscles.' WHERE name = 'Circuit Training';

UPDATE workout_templates SET description = 'Focus on your lower body with this intensive leg day workout. This session targets your glutes, quads, hamstrings, and calves through a variety of compound and isolation exercises. Whether you''re looking to build strength, improve muscle definition, or enhance athletic performance, this workout delivers results.' WHERE name = 'Leg Day';

UPDATE workout_templates SET description = 'Find balance and inner peace with this mindfulness-focused workout. This session combines gentle movement, breathing exercises, and meditation techniques to reduce stress, improve mental clarity, and promote overall well-being. Perfect for anyone looking to improve their mental health alongside their physical fitness.' WHERE name = 'Mindfulness Movement'; 