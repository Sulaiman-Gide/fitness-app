-- Add descriptions column to workout_templates table
ALTER TABLE workout_templates ADD COLUMN description TEXT;

-- Update workout templates with real descriptions. You can run this script multiple times safely.

UPDATE workout_templates 
SET description = 'A session focused on deep stretching to improve mobility, release muscle tension, and enhance recovery. This workout is perfect for all fitness levels and helps prevent injuries by increasing your range of motion and promoting relaxation.'
WHERE name = 'Deep Stretch';

UPDATE workout_templates 
SET description = 'Transform your body with this comprehensive full-body strength workout. This session targets all major muscle groups through compound movements and isolation exercises, helping you build lean muscle mass and improve overall strength. Perfect for intermediate to advanced fitness enthusiasts looking to challenge themselves and see real results.' 
WHERE name = 'Full Body Strength';

UPDATE workout_templates 
SET description = 'Get your heart pumping with this high-energy cardio session designed to burn calories and boost your endurance. This workout combines running intervals, jumping exercises, and dynamic movements to maximize fat burn while keeping your metabolism elevated for hours after your session. Ideal for anyone looking to improve cardiovascular health and shed those extra pounds.' 
WHERE name = 'Cardio Blast';

UPDATE workout_templates 
SET description = 'Experience the ultimate fat-burning workout with this intense HIIT session. High-Intensity Interval Training alternates between maximum effort bursts and recovery periods, creating an afterburn effect that continues to burn calories long after your workout. This session will challenge your limits and push you to new levels of fitness performance.' 
WHERE name = 'HIIT Fat Burner';

UPDATE workout_templates 
SET description = 'Focus on building a strong, sculpted upper body with this targeted workout. This session emphasizes chest, back, shoulders, and arms through a variety of pushing and pulling movements. Whether you''re looking to build muscle mass or tone your upper body, this workout provides the perfect balance of strength and definition exercises.' 
WHERE name = 'Upper Body Power';

UPDATE workout_templates 
SET description = 'Strengthen your core and lower body with this dynamic leg and core focused session. This workout targets your glutes, quads, hamstrings, and core muscles through functional movements that improve balance, stability, and overall athletic performance. Perfect for building a strong foundation and improving your posture.' 
WHERE name = 'Legs & Core';

UPDATE workout_templates 
SET description = 'Find your inner peace and improve flexibility with this calming yoga flow session. This gentle yet effective workout combines stretching, breathing exercises, and mindful movement to reduce stress, increase flexibility, and promote mental clarity. Ideal for recovery days or anyone looking to improve their mind-body connection.' 
WHERE name = 'Yoga Flow';

UPDATE workout_templates 
SET description = 'Build explosive power and athletic performance with this plyometric-focused workout. This session incorporates jumping, bounding, and dynamic movements that improve your vertical leap, sprint speed, and overall athletic ability. Perfect for athletes and fitness enthusiasts looking to enhance their performance in sports and daily activities.' 
WHERE name = 'Plyometric Power';

UPDATE workout_templates 
SET description = 'Sculpt and tone your entire body with this bodyweight-focused workout. No equipment needed! This session uses your own body weight to build strength, improve muscle tone, and enhance functional fitness. Perfect for home workouts or when you''re traveling and want to maintain your fitness routine.' 
WHERE name = 'Bodyweight Sculpt';

UPDATE workout_templates 
SET description = 'Target your core muscles with this intensive ab and core strengthening session. This workout goes beyond basic crunches to include functional core movements that improve stability, balance, and overall strength. You''ll work your entire core including rectus abdominis, obliques, and deep stabilizing muscles.' 
WHERE name = 'Core Crusher';

UPDATE workout_templates 
SET description = 'Improve your flexibility and mobility with this comprehensive stretching session. This workout focuses on increasing your range of motion, reducing muscle tension, and preventing injuries through dynamic and static stretching techniques. Perfect for recovery days or as a warm-up before more intense workouts.' 
WHERE name = 'Flexibility Flow';

UPDATE workout_templates 
SET description = 'Build strength and endurance with this circuit training session. This workout combines strength exercises with cardio intervals to create a comprehensive full-body workout that burns calories and builds muscle simultaneously. The circuit format keeps your heart rate elevated while challenging your muscles.' 
WHERE name = 'Circuit Training';

UPDATE workout_templates 
SET description = 'Focus on your lower body with this intensive leg day workout. This session targets your glutes, quads, hamstrings, and calves through a variety of compound and isolation exercises. Whether you''re looking to build strength, improve muscle definition, or enhance athletic performance, this workout delivers results.' 
WHERE name = 'Leg Day';

UPDATE workout_templates 
SET description = 'Find balance and inner peace with this mindfulness-focused workout. This session combines gentle movement, breathing exercises, and meditation techniques to reduce stress, improve mental clarity, and promote overall well-being. Perfect for anyone looking to improve their mental health alongside their physical fitness.' 
WHERE name = 'Mindfulness Movement';

-- This script will completely reset and re-seed your workout_templates table.
-- It ensures a fresh start with high-quality, consistent data.

-- Step 1: Remove all existing data from the table to prevent duplicates and old data issues.
TRUNCATE TABLE public.workout_templates RESTART IDENTITY CASCADE;

-- Step 2: Insert a new, curated list of high-quality workout templates.
INSERT INTO public.workout_templates (name, category, difficulty, estimated_duration_minutes, media_url, description)
VALUES
-- Strength
('Full Body Strength', 'Strength', 'Intermediate', 45, 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A comprehensive session targeting all major muscle groups to build balanced, functional strength. This workout combines foundational compound lifts like squats, deadlifts, and bench presses with targeted isolation exercises. It is designed to maximize muscle hypertrophy and improve your overall metabolic rate. Ideal for those looking to build a solid foundation of strength and see noticeable muscle growth.'),
('Upper Body Power', 'Strength', 'Intermediate', 35, 'https://images.pexels.com/photos/3837464/pexels-photo-3837464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Focus on building a strong, sculpted upper body with this targeted workout. The session emphasizes key muscle groups including the chest, back, shoulders, and arms through a variety of pushing and pulling movements. You will work through classic exercises like pull-ups, rows, and overhead presses to build both strength and definition. Perfect for achieving a powerful and well-defined physique.'),
('Legs & Core', 'Strength', 'Advanced', 50, 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Strengthen your foundation from the ground up with this dynamic and challenging leg and core session. This workout targets your glutes, quads, hamstrings, and abdominal muscles through functional movements that improve stability, power, and athletic performance. Expect a high-volume session with exercises like lunges, leg presses, and planks to build a rock-solid lower body and core.'),
('Bodyweight Sculpt', 'Strength', 'Beginner', 30, 'https://images.pexels.com/photos/4752861/pexels-photo-4752861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Sculpt and tone your entire body using only the power of your own bodyweight. This accessible yet effective session proves you don''t need a gym to build strength, improve muscle definition, and enhance functional fitness. It includes push-up variations, squats, and core work. Perfect for home workouts, travel, or anyone new to strength training.'),
('Core Crusher', 'Strength', 'Intermediate', 20, 'https://images.pexels.com/photos/8687355/pexels-photo-8687355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Go beyond basic crunches and target your entire core with this intensive strengthening session. This workout utilizes a variety of functional movements, including planks, leg raises, and anti-rotation exercises, to improve stability, balance, and overall strength. A strong core is the foundation of all movement, and this session will help you build a rock-solid midsection.'),
('Kettlebell Power', 'Strength', 'Intermediate', 30, 'https://images.pexels.com/photos/4325450/pexels-photo-4325450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Unlock full-body power and endurance with this dynamic kettlebell workout. Combining swings, presses, and squats, this session offers a unique blend of strength and cardiovascular training. Kettlebells challenge your stability and grip strength, providing a highly efficient and functional workout.'),
('Dumbbell Definition', 'Strength', 'All Levels', 40, 'https://images.pexels.com/photos/2204196/pexels-photo-2204196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Isolate and define muscle groups with this classic dumbbell workout. This session allows for a great range of motion and unilateral training to correct muscle imbalances. It covers all major body parts with exercises like bicep curls, tricep extensions, and lateral raises for a sculpted look.'),

-- Cardio
('Cardio Kickstart', 'Cardio', 'Beginner', 25, 'https://images.pexels.com/photos/6456303/pexels-photo-6456303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Gently elevate your heart rate and boost your energy with this accessible cardio session. Perfect for beginners or as a recovery workout, this routine uses simple, low-impact movements to improve cardiovascular health and burn calories. It's a great way to build a consistent cardio habit without putting stress on your joints.'),
('Cardio Blast', 'Cardio', 'Intermediate', 30, 'https://images.pexels.com/photos/3775131/pexels-photo-3775131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A high-energy cardio session designed to maximize calorie burn and boost your endurance. This workout combines a variety of modalities including running, high knees, and jumping jacks to keep your heart rate in the optimal zone. It's a fun, fast-paced challenge that will leave you feeling accomplished and energized.'),
('Runner''s Endurance', 'Cardio', 'Advanced', 45, 'https://images.pexels.com/photos/1127025/pexels-photo-1127025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Improve your running performance and stamina with this endurance-focused workout. This session is structured with interval training, negative splits, and tempo runs to increase your VO2 max and lactate threshold. Whether you're training for a race or just want to run longer and faster, this workout will help you reach your goals.'),
('Jump Rope Shred', 'Cardio', 'Intermediate', 20, 'https://images.pexels.com/photos/4327135/pexels-photo-4327135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Shred fat and improve coordination with this fast-paced and fun jump rope workout. This session is a highly effective way to get a full-body cardio workout in a short amount of time, improving your agility, timing, and cardiovascular fitness. It includes various jump styles to keep things interesting.'),
('Cycling Surge', 'Cardio', 'Intermediate', 40, 'https://images.pexels.com/photos/1634033/pexels-photo-1634033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Experience the thrill of the ride with this indoor cycling workout. This session simulates varied terrains with a mix of hill climbs, sprints, and flat roads to challenge your cardiovascular system and build lower body strength. Perfect for a low-impact, high-intensity burn.'),

-- HIIT
('HIIT Fat Burner', 'HIIT', 'Advanced', 25, 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Experience the ultimate metabolic challenge with this intense HIIT session designed for maximum fat-burning. High-Intensity Interval Training alternates between all-out effort and brief recovery periods to skyrocket your heart rate and trigger the afterburn effect (EPOC), where you continue to burn calories long after the workout is over.'),
('Total Body HIIT', 'HIIT', 'Intermediate', 30, 'https://images.pexels.com/photos/270085/pexels-photo-270085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A high-intensity interval workout that challenges your entire body from head to toe. Using a powerful mix of explosive strength exercises and heart-pumping cardio, this session will push your limits and deliver a comprehensive, efficient workout. Get ready to sweat and feel the burn in every muscle.'),
('Beginner HIIT', 'HIIT', 'Beginner', 20, 'https://images.pexels.com/photos/3112004/pexels-photo-3112004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A gentle yet effective introduction to the world of High-Intensity Interval Training. This workout uses modified, low-impact exercises and slightly longer recovery times to help you build confidence and experience the benefits of HIIT safely. It's the perfect starting point to ramp up your fitness level.'),
('Plyometric Power', 'HIIT', 'Advanced', 35, 'https://images.pexels.com/photos/2011383/pexels-photo-2011383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Build explosive power, agility, and athletic performance with this plyometric-focused workout. This session incorporates dynamic movements like box jumps, burpees, and broad jumps to improve your vertical leap, sprint speed, and overall athletic ability. Ideal for athletes and fitness enthusiasts looking to gain a competitive edge.'),
('Tabata Challenge', 'HIIT', 'Advanced', 20, 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Take on the Tabata protocol: 20 seconds of ultra-intense work followed by 10 seconds of rest, repeated for 8 rounds. This workout is brutally effective and scientifically proven to improve both aerobic and anaerobic fitness in record time. It's short, intense, and incredibly rewarding.'),

-- Flexibility
('Deep Stretch', 'Flexibility', 'All Levels', 25, 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A session focused on deep, static stretching to improve mobility, release chronic muscle tension, and enhance recovery. This workout is perfect for all fitness levels and helps prevent injuries by increasing your functional range of motion. You will hold each stretch for an extended period to allow your muscles to relax and lengthen.'),
('Flexibility Flow', 'Flexibility', 'Intermediate', 30, 'https://images.pexels.com/photos/7187518/pexels-photo-7187518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Improve your dynamic flexibility and mobility with this comprehensive stretching session that flows from one movement to the next. This workout focuses on increasing your active range of motion through controlled, fluid stretches. It is perfect for recovery days or as a way to prepare your body for more intense activity.'),
('Morning Mobility', 'Flexibility', 'Beginner', 15, 'https://images.pexels.com/photos/8436576/pexels-photo-8436576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Start your day with gentle, purposeful movements designed to awaken your body, lubricate your joints, and improve mobility. This short session is perfect for shaking off morning stiffness and preparing your body for the demands of the day ahead. You'll feel more open, energized, and ready to move.'),
('Post-Workout Cool Down', 'Flexibility', 'All Levels', 10, 'https://images.pexels.com/photos/4754023/pexels-photo-4754023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'An essential cool down routine to perform after any workout. This series of targeted static stretches helps to gradually lower your heart rate, reduce the risk of muscle soreness (DOMS), and improve your long-term flexibility. Never skip your cool down; it's crucial for recovery and injury prevention.'),
('Full Body Foam Rolling', 'Flexibility', 'All Levels', 20, 'https://images.pexels.com/photos/864939/pexels-photo-864939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Use a foam roller to perform self-myofascial release, a form of massage to relieve muscle tightness and trigger points. This session will guide you through rolling all major muscle groups to improve flexibility, reduce soreness, and enhance recovery.'),

-- Mindfulness
('Mindfulness Movement', 'Mindfulness', 'All Levels', 25, 'https://images.pexels.com/photos/4151973/pexels-photo-4151973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Find balance and inner peace with this mindfulness-focused workout. This session combines gentle, flowing movements with focused breathing exercises and meditation techniques to reduce stress, center your mind, and improve your mind-body connection. It is a workout for both your physical and mental well-being.'),
('Yoga Flow', 'Mindfulness', 'Intermediate', 40, 'https://images.pexels.com/photos/4662356/pexels-photo-4662356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Connect breath to movement in this calming Vinyasa yoga flow. This gentle yet effective workout builds heat and strength while combining stretching, breathing exercises, and mindful movement. It is designed to reduce stress, improve flexibility, and promote a state of mental clarity and calm.'),
('Restorative Yoga', 'Mindfulness', 'Beginner', 30, 'https://images.pexels.com/photos/5030869/pexels-photo-5030869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Experience deep relaxation with this restorative yoga practice. Using props like pillows and blankets to completely support your body, this session allows you to hold gentle poses for longer periods. This process releases deep-seated tension, calms the nervous system, and promotes profound rest. It's perfect for active stress relief.'),
('Guided Meditation', 'Mindfulness', 'All Levels', 15, 'https://images.pexels.com/photos/3864683/pexels-photo-3864683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A guided meditation to help you calm a busy mind, reduce anxiety, and cultivate a sense of inner peace and awareness. No movement is required, just a quiet space to sit or lie down and follow the guidance. This is a perfect introduction to mindfulness or a way to deepen your existing practice.'),
('Mindful Walking', 'Mindfulness', 'All Levels', 20, 'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Turn a simple walk into a meditative practice. This audio-guided session will help you focus on the physical sensations of walking and the environment around you, bringing a state of calm awareness to your mind. It can be done anywhere, indoors or outdoors.'),
('Breathing Exercises', 'Mindfulness', 'All Levels', 10, 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Learn and practice powerful breathing techniques (pranayama) to influence your mental and physical state. This session covers techniques for energizing, calming, and balancing the body and mind. A simple yet profound tool for managing stress and improving focus.'); 