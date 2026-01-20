# FlexiHome: Home Energy Management System<br><br>FlexiHome Mobile App 🔌

## Description

This repository contains the **FlexiHome Mobile App**, a core component of the Home Energy Management System (FlexiHome).
The **FlexiHome Mobile App** is a React Native application designed to be a simple user interface for end clients of FlexiHome (residential users). It allows users to **connect, monitor and manage their devices** on FlexiHome. Furthermore, it informs and educates users about their **flexibility actions** and **incentives**.
It connects to the FlexiHome cloud micro-services using the REST API protocol and connecting to an **API Gateway**.

## Table of Contents

- [FlexiHome: Home Energy Management SystemFlexiHome Mobile App 🔌](#flexihome-home-energy-management-systemflexihome-mobile-app-)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [FlexiHome Overview](#flexihome-overview)
    - [Visit all the FlexiHome micro-services:](#visit-all-the-flexihome-micro-services)
  - [📂 Project Structure](#-project-structure)
    - [Project Status](#project-status)
    - [Technology Stack](#technology-stack)
    - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Known Issues](#known-issues)
  - [Open Source Licensing Info](#open-source-licensing-info)
    - [Contacts](#contacts)

---

## FlexiHome Overview

EMSs (Energy Management Systems) play a key role in the flexibility enablement of consumers, residential and tertiary, which is paramount to accessing the previously untapped flexibility potential of residential DERs (Distributed Energy Resources). These resources, under the form of energy assets, are usually household appliances like heat pumps, EV chargers, dishwashers, PV inverts, batteries, etc. This is where the FlexiHome (Home Energy Management System) comes in. 

The goal of this system is to facilitate the user’s participation in the flexibility value chain, while providing them with incentives in a clear, explainable way.

To fulfill this goal in an effective and scalable way, the FlexiHome is designed with a micro-services architecture (below), orchestrated in a Kubernetes environment, where each micro-service is modular and can be replaced or expanded, without breaking the remaining logic.

![FlexiHome Architecture](docs/diagrams/hems-architecture-diagram.svg)

FlexiHome utilizes an IoT interoperable gateway (FlexiHome Hub) to connect to the end users DERs via interoperable protocols like OCPP and Modbus, which connects with the cloud system (FlexiHome Cloud) via an MQTT message broker.

The cloud operations are done via micro-services, where the flexibility optimization algorithms run. To complement these micro-services, support applications like postgres (database), elasticsearch (log database), prometheus (performance metrics) and grafana (metrics dashboard) are used.

Lastly, the user can view the information regarding their devices and flexibility on a user interface provided by the mobile app, which accesses the FlexiHome microservices using a REST API Gateway for additional security measures and routing of requests.

### Visit all the FlexiHome micro-services:
- [FlexiHome Account Manager](https://github.com/INESCTEC/hems-account-manager) - Manages user accounts, authentication, and implements cybersecurity measures within the FlexiHome ecosystem
- [FlexiHome Statistics Manager](https://github.com/INESCTEC/hems-statistics-manager) - Collects and processes data gathered from IoT devices connected to the FlexiHome ecosystem
- [FlexiHome Device Manager](https://github.com/INESCTEC/hems-device-manager) - Responsible for the integration and management of IoT devices to the FlexiHome ecosystem
- [FlexiHome Energy Manager](https://github.com/INESCTEC/hems-energy-manager) - Receives grid needs inputs from system operators and user comfort inputs to optimized the flexibility bids taken to market 
- [FlexiHome Hub](https://github.com/INESCTEC/hems-hub) - IoT interoperable gateway that implements the communication, using MQTT protocol, between the DERs and the FlexiHome services on the cloud
- [FlexiHome Mobile App](https://github.com/INESCTEC/hems-app) - mobile application targetted for residential end consumers to manage their flexible DERs. Available in Android and iOS

---

## 📂 Project Structure
```
.
├── Dockerfile              # Docker build instructions
├── docker-compose.yml      # Compose setup (Hub + Broker integration)
├── config.py               # Environment & config loader
├── main.py                 # Entry point for the HEMS Hub
├── device_registry.json    # Device registry (managed by the Hub)
├── hub.id                  # Unique identifier for the Hub
├── core/                   # Core services (hub state, scheduler)
├── devices/                # Device definitions and registry
├── mqtt/                   # MQTT client, handlers, topics, schemas
├── protocols/              # Protocol integrations (e.g. Modbus, OCPP)
├── utils/                  # Utility functions
└── requirements.txt        # Python dependencies
```
### Project Status

- 🚧 In Progress: Actively being developed; features and structure may change.


### Technology Stack

- **Programming Language:** Python 3.8
- **Frameworks/Libraries:** Flask, SQLAlchemy, Alembic
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes (recommended for deployment)
- **Other Tools:** Alembic (migrations), pytest (testing)


### Dependencies

All required packages are listed in `package.json`.


## Installation

Follow these steps to install and set up the Account Manager Service:

1. **Clone the repository:**
  git clone https://github.com/INESCTEC/hems-account-manager.git
  cd account-manager-service
  ```

---

## Usage

>Requirements:
- Nodejs 18+



#### App UI Components 
App uses [React Native Paper](https://callstack.github.io/react-native-paper/) library.\
Check documentation [here](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator).

#### Install Expo SDK53
See documentation [here](https://expo.dev/changelog/sdk-53)
```bash
npm i -g eas-cli
npm install expo@^53.0.0
npx expo install --fix

npx expo-doctor@latest

## add environment variables in a .env file
PROD_BASE_URL=
DEV_BASE_URL=
APP_POLICY_VERSION=

# start the app
npx expo start -c

# Build the app to an emulator
eas build -p android --profile preview --message "V1.0.2"

# Build a development build with expo dev client bundled (also results in an .apk)
eas build --platform android --profile development --message "Dev build for emulator"

# Next, install the app on the emulator/device and run with
npx expo start

# packages needed when using development builds
npx expo install expo-updates
npx expo install expo-dev-client
```

#### Android Studio & emulator
```bash 
# list avd devices
adb devices

# TODO:
emulator -list-avds
# run the emulator
# [text](https://developer.android.com/studio/run/emulator-commandline)
# emulator -avd avd_name [ {-option [value]} ]
emulator @avd_name 
emulator @Pixel8_API_34 -wipe-data 
#-- (disable wifi)
emulator @Pixel8_API_34 -feature -Wifi 
# help
emulator -help-[option]

```
### Useful links
#### [Commands](https://developer.android.com/studio/run/emulator-commandline#common)

#### [Network redirection](https://developer.android.com/studio/run/emulator-networking#redirection)

#### [Use proxy](https://developer.android.com/studio/run/emulator-networking#proxy)


#### [Build for the 1st time for expo servers - Configure eas](https://docs.expo.dev/tutorial/eas/configure-development-build/)

#### [Create a buid](https://docs.expo.dev/develop/development-builds/create-a-build/)


```bash
# link local project to expo servers (skip if already done)
eas init

# update app.config.js accordingly to the output messages from expo eas
# keep doing init command and updating app.config.js until "Project already linked" is a result

# building your preview release
eas build --platform android --profile preview


```

#### Extra: Generate app backgrounds
https://www.svgbackgrounds.com/set/free-svg-backgrounds-and-patterns/

Dont't forget the attributions\
Example: 
[SVGBackgrounds.com](https://www.svgbackgrounds.com/elements/triple-threat-svg-icons/)![flexihome-logo](docs/logo/flexihome-logo.png)

---

## Known Issues

- No major issues reported. Please use GitHub Issues to report bugs or request features.

---

## Open Source Licensing Info

See [`LICENSE`](LICENSE) for details on usage rights and licensing.

---

### Contacts

For questions or support, contact:
- Vasco Manuel Campos: vasco.m.campos@inesctec.pt
- João Paulo Pacheco: joao.p.pacheco@inesctec.pt


**Last updated: 06.10.2025**