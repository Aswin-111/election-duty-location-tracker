import React from 'react';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack } from 'expo-router';


NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  return (
    <Stack/>
  );
}