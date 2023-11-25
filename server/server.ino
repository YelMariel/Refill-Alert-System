#include <ArduinoJson.h>
#include <ArduinoOTA.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <EEPROM.h>

const int BLUE_LED = D3;
const int RED_LED = D4;
const int GREEN_LED = D5;
const int YELLOW_LED = D6;
const int RELAY_CONTROL_PIN = D1;
const int WATER_DETECTION_PIN = D2;
const int EEPROM_consumed = 0;

const char* ssid = "Node";
const char* passphrase = "node";

const int intervalConnecting = 1000; 
const int intervalConnected = 3000;  

ESP8266WebServer server(80);

int consumed = 0;
int consumedChecker = 0;
int limitNum = 3;
bool switchToken = true;
bool timeToken = true;
bool relayState = HIGH;  // Add this line

unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("Disconnecting current wifi connection");
  WiFi.disconnect();
  EEPROM.begin(512);
  delay(10);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println();
  Serial.println();
  Serial.println("Startup");

  String esid;
  for (int i = 0; i < 32; ++i) {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("SSID: ");
  Serial.println(esid);
  Serial.println("Reading EEPROM pass");

  String epass = "";
  for (int i = 32; i < 96; ++i) {
    epass += char(EEPROM.read(i));
  }
  Serial.print("PASS: ");
  Serial.println(epass);

  WiFi.begin(esid.c_str(), epass.c_str());
  if (testWifi()) {
    Serial.println("Successfully Connected!!!");
  } else {
    Serial.println("Turning the HotSpot On");
    launchWeb();
    setupAP();
  }

  pinMode(WATER_DETECTION_PIN, INPUT);
  pinMode(RELAY_CONTROL_PIN, OUTPUT);
  digitalWrite(RELAY_CONTROL_PIN, HIGH);
  
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);

  EEPROM.get(EEPROM_consumed, consumed);

  setupServerRoutes();

  server.begin();

  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();

  unsigned long currentMillis = millis();
  if (WiFi.status() == WL_CONNECTED) {
    if (currentMillis - previousMillis >= intervalConnected) {
      previousMillis = currentMillis;
      digitalWrite(BLUE_LED, !digitalRead(BLUE_LED));
    }
  }
}

bool testWifi() {
  int c = 0;
  Serial.println("Waiting for Wifi to connect");
  while (c < 20) {
    if (WiFi.status() == WL_CONNECTED) {
      return true;
    }
    delay(500);
    Serial.print("*");
    c++;
  }
  Serial.println("");
  Serial.println("Connect timed out, opening AP");
  return false;
}

void launchWeb() {
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
    Serial.println("WiFi connected");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("SoftAP IP: ");
  Serial.println(WiFi.softAPIP());
  createWebServer();
  server.begin();
  Serial.println("Server started");
}

void setupAP() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  delay(100);
  WiFi.softAP("ElectronicsInnovation", "");
  Serial.println("Initializing_softap_for_wifi credentials_modification");
  launchWeb();
  Serial.println("over");
}

void createWebServer() {
  server.on("/", []() {
    IPAddress ip = WiFi.softAPIP();
    String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
    String content = "<!DOCTYPE HTML>\r\n<html>Welcome to Wifi Credentials Update page";
    content += "<form action=\"/scan\" method=\"POST\"><input type=\"submit\" value=\"scan\"></form>";
    content += ipStr;
    content += "<p>";
    content += "</p><form method='get' action='setting'><label>SSID: </label><input name='ssid' length=32><input name='pass' length=64><input type='submit'></form>";
    content += "</html>";
    server.send(200, "text/html", content);
  });

  server.on("/scan", []() {
    IPAddress ip = WiFi.softAPIP();
    String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
    String content = "<!DOCTYPE HTML>\r\n<html>go back";
    server.send(200, "text/html", content);
  });

  server.on("/setting", []() {
    String qsid = server.arg("ssid");
    String qpass = server.arg("pass");
    if (qsid.length() > 0 && qpass.length() > 0) {
      Serial.println("clearing eeprom");
      for (int i = 0; i < 96; ++i) {
        EEPROM.write(i, 0);
      }
      Serial.println(qsid);
      Serial.println("");
      Serial.println(qpass);
      Serial.println("");

      Serial.println("writing eeprom ssid:");
      for (int i = 0; i < qsid.length(); ++i) {
        EEPROM.write(i, qsid[i]);
        Serial.print("Wrote: ");
        Serial.println(qsid[i]);
      }
      Serial.println("writing eeprom pass:");
      for (int i = 0; i < qpass.length(); ++i) {
        EEPROM.write(32 + i, qpass[i]);
        Serial.print("Wrote: ");
        Serial.println(qpass[i]);
      }
      EEPROM.commit();

      String content = "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}";
      server.send(200, "application/json", content);
      ESP.reset();
    } else {
      String content = "{\"Error\":\"404 not found\"}";
      server.send(404, "application/json", content);
      Serial.println("Sending 404");
    }
  });
}

void setupServerRoutes() {
  server.on("/getwaterstatus", HTTP_GET, handleWaterStatus);
  server.on("/setparams", HTTP_POST, handleSetParams);
  server.on("/setparams", HTTP_OPTIONS, handleCorsOptions);
}

void handleCorsOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Max-Age", "10000");
  server.sendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.send(200, "text/plain", "");
}

void handleSetParams() {
  handleCors();

  if (server.method() == HTTP_OPTIONS) {
    server.send(200, "text/plain", "");
    return;
  }

  StaticJsonDocument<200> jsonDoc;
  DeserializationError error = deserializeJson(jsonDoc, server.arg("plain"));

  if (error) {
    server.send(400, "text/plain", "Invalid JSON");
    return;
  }

  int receivedLimit = jsonDoc["limit"];
  int receivedSwitch = jsonDoc["switch"];
  int receivedTime = jsonDoc["time"];

  limitNum = receivedLimit;
  switchToken = receivedSwitch != 0;
  timeToken = receivedTime != 0;

  sendSuccessResponse("Params set successfully");
}

void handleWaterStatus() {
  DynamicJsonDocument jsonDoc(256);
  int waterStatus = digitalRead(WATER_DETECTION_PIN);

  if (!switchToken && !timeToken && consumed >= limitNum) {
    handleRelayControl(HIGH);
    jsonDoc["token"] = 0;    
    digitalWrite(YELLOW_LED, HIGH);
    handleWaterStatusConditions(waterStatus, jsonDoc);
  } else if (!switchToken && !timeToken) {
    handleRelayControl(HIGH);
    jsonDoc["token"] = 0;
    digitalWrite(YELLOW_LED, HIGH);
    handleWaterStatusConditions(waterStatus, jsonDoc);
  } else {
    handleWaterStatusConditions(waterStatus, jsonDoc);
  }

  jsonDoc["id"] = "1";
  if (waterStatus == HIGH){
    jsonDoc["water_level"] = "HIGH";
  }
  else{
    jsonDoc["water_level"] = "LOW";
  }
  jsonDoc["consumed"] = consumed;
  jsonDoc["limit"] = limitNum;

  String jsonResponse;
  serializeJson(jsonDoc, jsonResponse);
  server.send(200, "application/json", jsonResponse);
}

void handleRelayControl(int state) {
  digitalWrite(RELAY_CONTROL_PIN, state);
  relayState = state == LOW ? HIGH : LOW;
}

void handleWaterStatusConditions(int waterStatus, DynamicJsonDocument& jsonDoc) {
  if (waterStatus == HIGH) {
    consumedChecker = 0;
    handleRelayControl(HIGH);
    jsonDoc["token"] = 1;
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
  } else if (waterStatus == LOW) {
    if (consumedChecker == 1) {
      consumed += 1;  
      EEPROM.put(EEPROM_consumed, consumed);
      consumedChecker = 0;
      jsonDoc["token"] = 1;
    } else {
      jsonDoc["token"] = 1;
    }
    handleRelayControl(HIGH);
    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
  } else {
    jsonDoc["token"] = 0;
  }
}

void handleCors() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
}

void sendSuccessResponse(const char* message) {
  handleCors();
  server.send(200, "text/plain", message);
}
