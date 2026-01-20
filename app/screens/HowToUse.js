import React, { useEffect } from "react";
import { View, Image, ScrollView, SafeAreaView } from "react-native";
import { react_colors, styles } from "../styles";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { CardSlider } from "../components/ImageSlider";

const slides = [
  {
    evCharger: [
      {
        id: 11,
        texts: [
          "Carregue o seu carro durante as horas de tarifa reduzida — a mesma energia pode custar até metade do preço.",
          "Programe o carregamento apenas até 80% no dia a dia. É mais rápido, protege a bateria e poupa energia.",
          "Evite carregar em simultâneo com outros equipamentos de alto consumo — ajuda a equilibrar a rede da casa.",
        ],
        backdrop: require("../assets/icons/charging-station-fill.png"),
      },
    ],
  },
  {
    washingMachine: [
      {
        id: 21,
        texts: [
          "Lave com carga completa e a baixas temperaturas (30 °C é suficiente na maioria das vezes). Gasta menos energia e protege a roupa.",
          "Use programas rápidos/eco sempre que possível: reduzem a energia sem comprometer a lavagem.",
          "Programe as lavagens para os horários de tarifa reduzida e veja a diferença na fatura.",
        ],
        backdrop: require("../assets/icons/washing-machine-fill.png"),
      },
    ],
  },
  {
    airConditioner: [
      {
        id: 31,
        texts: [
          "Defina a temperatura entre 24–26 °C no verão e 19–21 °C no inverno. Pequenos ajustes reduzem até 10% da sua fatura.",
          "Use o ar condicionado apenas em divisões ocupadas — desligar em espaços vazios poupa energia sem perder conforto.",
          "Prefira ventoinhas em dias amenos: gastam até 10 vezes menos energia do que o ar condicionado.",
        ],
        backdrop: require("../assets/icons/air-conditioner-fill.png"),
      },
    ],
  },
];

const HowToUse = () => {
  const [t, i18n] = useTranslation();
  const [randomSlide, setRandomSlide] = React.useState(null);
  const [randomSlideText, setRandomSlideText] = React.useState(null);
  const [infoSlides, setInfoSlides] = React.useState(slides);

  const getRandomSlide = () => {
    if (infoSlides && infoSlides.length > 0) {
      let randomIndex = Math.floor(Math.random() * infoSlides.length);
      let randomInfo = Math.floor(Math.random() * 3);

      let obj = Object.keys(infoSlides[randomIndex])[0];
      let objInfo = infoSlides[randomIndex][obj];
      // console.log("keys", objInfo[0].texts[randomInfo]);

      setRandomSlideText(objInfo[0].texts[randomInfo]);
      setRandomSlide(objInfo[0].backdrop);
    }
  };
  useEffect(() => {
    // console.log("infoSlides", infoSlides);
    getRandomSlide();
  }, [infoSlides]);

  return (
    <SafeAreaView style={(styles.container, styles.global_color)}>
      <View style={{ width: "100%", height: "auto", paddingTop: 20 }}>
        <View
          style={[
            styles.view_item,
            { paddingVertical: 4, alignSelf: "center" },
          ]}
        >
          <Text variant="titleLarge" style={{ textAlign: "center" }}>
            {t("Como obter benefícios com a app")}
          </Text>
        </View>
        <CardSlider texts={randomSlideText} backdrop={randomSlide} />
      </View>
    </SafeAreaView>
  );
};

export default HowToUse;
