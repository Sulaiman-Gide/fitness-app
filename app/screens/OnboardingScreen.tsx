import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Find Your Perfect Rental Space With Ease",
    description:
      "Are you a free-spirited nomad? Find your ideal space with us. Enjoy short stays or extended visits in our carefully curated properties.",
    image: require("@/assets/images/photo-1.jpg"),
  },
  {
    key: "2",
    title: "List and Manage Properties and Guests Effortlessly",
    description:
      "Our comprehensive platform streamlines property management, saves you time, and enhances your business operations.",
    image: require("@/assets/images/photo-2.jpg"),
  },
  {
    key: "3",
    title: "We Connect Homes, Guests, and Property Managers",
    description:
      "We’re committed to bridging the gap between guests, property managers, and homes for a seamless living experience.",
    image: require("@/assets/images/photo-3.jpg"),
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Update currentIndex on manual scroll
  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={styles.background}>
            <View style={styles.overlay}>
              <View style={styles.textBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <View style={styles.dotsContainer}>
                {slides.map((_, i) => {
                  const inputRange = [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                  ];
                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8.5, 22.5, 8.5],
                    extrapolate: "clamp",
                  });
                  const dotColor = scrollX.interpolate({
                    inputRange,
                    outputRange: ["#ccc", "#5755FF", "#ccc"],
                    extrapolate: "clamp",
                  });
                  return (
                    <Animated.View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          width: dotWidth,
                          backgroundColor: dotColor,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  style={styles.signUpButton}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginLink}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginLinkText}>
                    Already have an account?{" "}
                    <Text style={styles.loginLinkBold}>Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width,
    height,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.06,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textBox: {
    marginBottom: height * 0.04,
  },
  title: {
    maxWidth: width * 0.8,
    fontSize: width * 0.08,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    fontFamily: "BeVietnamPro-Regular",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: width * 0.045,
    color: "#dcdcdc",
    lineHeight: width * 0.066,
    fontFamily: "BeVietnamPro-Regular",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: height * 0.05,
    alignItems: "center",
  },
  dot: {
    height: 8.5,
    borderRadius: 4,
    marginHorizontal: 0,
  },
  buttonBox: {
    gap: 14,
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "#5755FF",
    paddingVertical: Platform.OS === "ios" ? 16 : 13,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  loginLink: {
    marginTop: 6,
  },
  loginLinkText: {
    color: "#dcdcdc",
    fontSize: width * 0.042,
    fontFamily: "BeVietnamPro-Regular",
    textAlign: "center",
  },
  loginLinkBold: {
    textDecorationLine: "underline",
    marginBottom: 1,
  },
  signUpText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Regular",
  },
  loginText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "600",
    fontFamily: "BeVietnamPro-Regular",
  },
});
