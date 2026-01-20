import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { react_colors } from "../styles";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("screen");
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
                ? { backgroundColor: react_colors.interconnect }
                : { backgroundColor: react_colors.gainsboro },
            ]}
          />
        );
      })}
    </View>
  );
};
const NotificationSlider = ({ data, navigate }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [viewIndex, setViewIndex] = useState(0);

  const [t, i18n] = useTranslation();

  const onScrollHandler = (event) => {
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
      useNativeDriver: false,
    })(event);
  };

  const handleItemsChanged = useRef(({ viewableItems }) => {
    setViewIndex(viewableItems[0].index);
  }).current;

  const viewableConfig = useRef({ itemVisiblePercentThreshold: 20 }).current;

  return (
    <List.Accordion
      id="0"
      title={
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <MaterialIcons
            name="info-outline"
            size={24}
            color={react_colors.indianred}
          />
          <Text style={{ fontSize: 18, color: react_colors.black }}>
            {t("NOTIFattention")}
          </Text>
        </View>
      }
      style={{
        width: "100%",
        justifyContent: "flex-start",
        alignSelf: "center",
        backgroundColor: react_colors.white,
      }}
    >
      <View
        style={{
          alignSelf: "center",
          marginHorizontal: 8,
          height: 155,
          backgroundColor: react_colors.ghostwhite,
        }}
      >
        <FlatList
          style={{ height: 145 }}
          data={data}
          horizontal
          pagingEnabled
          snapToAlignment="start"
          snapToInterval={width * 0.9 + 5}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: width * 0.9,
                height: 125,
                borderRadius: 10,
                backgroundColor: react_colors.goldenrod,
                paddingVertical: 10,
                marginRight: 5,
                overflow: "visible",
              }}
            >
              <View style={{ flex: 0.2, alignItems: "center" }}>
                <MaterialIcons name={item.icon} size={24} color="white" />
              </View>
              <View
                style={{
                  flex: 0.8,
                  justifyContent: "flex-start",
                  paddingHorizontal: 2,
                }}
              >
                <Text style={{ color: react_colors.floralwhite }}>
                  {item.description}
                </Text>

                {item.button && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderRadius: 4,
                        height: 30,
                        width: "50%",
                        backgroundColor: react_colors.white,
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                      onPress={() =>
                        navigate("Privacy", { cameFrom: "HomeScreen" })
                      }
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          color: react_colors.goldenrod,
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
          onScroll={onScrollHandler}
          onViewableItemsChanged={handleItemsChanged}
          viewabilityConfig={viewableConfig}
        />
        <Pagination data={data} scrollX={scrollX} index={viewIndex} />
      </View>
    </List.Accordion>
  );
};

export default React.memo(NotificationSlider);
