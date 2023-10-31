#include <ArduinoJson.h>
#include <ArduinoOTA.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

#define Water_Detection_Pin D3
#define Relay_Control_Pin D4

const char* ssid = "Realme";
const char* password = "12345aas";

ESP8266WebServer server(81);

bool relayState = HIGH;  // Initialize relay as OFF

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  pinMode(Water_Detection_Pin, INPUT);
  pinMode(Relay_Control_Pin, OUTPUT);
  digitalWrite(Relay_Control_Pin, relayState);  // Set the initial state (OFF)
  server.on("/getwaterstatus", HTTP_GET, handleWaterStatus);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

void handleWaterStatus() {
  DynamicJsonDocument jsonDoc(256);
  int WaterStatus = digitalRead(Water_Detection_Pin);
  int relayState = digitalRead(Relay_Control_Pin);
  
    if (WaterStatus == HIGH) {
    jsonDoc["water_level"] = "HIGH";
    jsonDoc["relay_state"] = relayState == HIGH ? "HIGH" : "LOW";
    digitalWrite(Relay_Control_Pin, LOW); 
    // Turn on the relay
    
  } else if (WaterStatus == LOW) {
    jsonDoc["water_level"] = "LOW";
    jsonDoc["relay_state"] = relayState == LOW ? "LOW" : "HIGH";
    digitalWrite(Relay_Control_Pin, HIGH); 
    // Turn off the relay
  } else {
    jsonDoc["water_level"] = "Not Detected";
    jsonDoc["water_level"] = "UNKNOWN";
  }

  String jsonResponse;
  serializeJson(jsonDoc, jsonResponse);
  server.send(200, "application/json", jsonResponse);
}