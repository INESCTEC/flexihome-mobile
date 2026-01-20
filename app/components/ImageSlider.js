import React, { useContext, useEffect, useState, useRef } from "react";
import {Animated, View, Image, Dimensions, ImageBackground } from "react-native";
import { Card, Text } from "react-native-paper";
import { styles, react_colors } from "../styles";

const { width, height } = Dimensions.get("screen");

const Pagination = ({ data, scrollX, index }) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data.map((item, idx) => {
        const dotWith = scrollX.interpolate({
          inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
          outputRange: [8, 12, 8],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={idx.toString()}
            style={[
              {
                width: dotWith,
                height: dotWith,
                borderRadius: 6,
                marginHorizontal: 3,
              },
              idx === index
                ? { backgroundColor: react_colors.primarygreen }
                : { backgroundColor: react_colors.complementarygray },
            ]}
          />
        );
      })}
    </View>
  );
};

export const CardSlider = ({ texts, backdrop }) => {
  // const scrollX = useRef(new Animated.Value(0)).current;
  // const [currentIndex, setCurrentIndex] = useState(0);
   
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
  //   }, 5000); // Change image every 5 seconds

  //   return () => clearInterval(interval);
  // }, [texts.length]);

  return (
    <View style={{ width: width, height: "auto", paddingTop: 20 }}>
      <Card
        style={[
          styles.card,
          { width: "100%", padding: 10, alignSelf: "center", marginBottom: 10 },
        ]}
      >
        <Card.Cover
          source={backdrop}
          style={{ width: "100%", height: height * 0.25, resizeMode: "contain", alignSelf: "center" }}
          resizeMode={"contain"}
        />
        <View style={[styles.card, { width: "90%", height: 100, padding: 10, alignSelf: "center"}]}>
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>
            {texts}
          </Text>
        </View>
      </Card>
      {/* <Pagination data={data} scrollX={scrollX} index={currentIndex} /> */}
    </View>
  );
};

export const ImageSlider = ({data}) => {
  const [images, setImages] = useState(data);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollHandler = (event) => {
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
      useNativeDriver: false,
    })(event);
  };

  const handleItemsChanged = useRef(({ viewableItems }) => {
    setViewIndex(viewableItems[0].index);
  }).current;

  const viewableConfig = useRef({ itemVisiblePercentThreshold: 20 }).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
      <View style={{ flex: 1, width: "100%", height: "100%", paddingTop: 20 }}>
      <ImageBackground
        source={{ uri: images[currentIndex].backdrop }}
        style={{
          flex: 1,
          width: width,
          height: height,
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.5,
        }}
        imageStyle={{
          resizeMode: "cover",
          alignSelf: "flex-start",
        }}
      ></ImageBackground>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={images[currentIndex].image}
            style={{
              width: width,
              height: 300,
              resizeMode: "contain",
              resizeMethod: "cover",
              marginHorizontal: 3,
              opacity: 1,
            }}
          />
          <Pagination data={images} scrollX={scrollX} index={currentIndex} />
        </View>
        <View
          style={{
            width: "100%",
            height: height,
            paddingHorizontal: 20,
            marginTop: 10,
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              color: react_colors.black,
              textAlign: "justify",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            {images[currentIndex].text}
          </Text>
        </View>
      </View>
  );
};

// export default React.memo(ImageSlider, CardSlider);