package com.farmconnect.automation.utils;

import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import java.time.Duration;
import java.util.Collections;

/**
 * GestureUtils - Touch gesture utilities for mobile interactions.
 */
public class GestureUtils {

    private final AndroidDriver driver;

    public GestureUtils(AndroidDriver driver) { this.driver = driver; }

    public void swipeUp() { swipe(0.5, 0.8, 0.5, 0.2); }
    public void swipeDown() { swipe(0.5, 0.2, 0.5, 0.8); }
    public void swipeLeft() { swipe(0.8, 0.5, 0.2, 0.5); }
    public void swipeRight() { swipe(0.2, 0.5, 0.8, 0.5); }

    public void swipe(double startXPct, double startYPct, double endXPct, double endYPct) {
        Dimension size = driver.manage().window().getSize();
        int startX = (int)(size.width * startXPct);
        int startY = (int)(size.height * startYPct);
        int endX = (int)(size.width * endXPct);
        int endY = (int)(size.height * endYPct);

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence swipeSeq = new Sequence(finger, 1);
        swipeSeq.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY));
        swipeSeq.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        swipeSeq.addAction(finger.createPointerMove(Duration.ofMillis(600), PointerInput.Origin.viewport(), endX, endY));
        swipeSeq.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
        driver.perform(Collections.singletonList(swipeSeq));
    }

    public void tap(int x, int y) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence tapSeq = new Sequence(finger, 1);
        tapSeq.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), x, y));
        tapSeq.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        tapSeq.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
        driver.perform(Collections.singletonList(tapSeq));
    }

    public void longPress(int x, int y, int durationMs) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence longPressSeq = new Sequence(finger, 1);
        longPressSeq.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), x, y));
        longPressSeq.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        longPressSeq.addAction(finger.createPointerMove(Duration.ofMillis(durationMs), PointerInput.Origin.viewport(), x, y));
        longPressSeq.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
        driver.perform(Collections.singletonList(longPressSeq));
    }

    public void scrollToBottom() { for(int i=0;i<5;i++) { swipeUp(); try{Thread.sleep(500);}catch(Exception e){} } }
    public void scrollToTop() { for(int i=0;i<5;i++) { swipeDown(); try{Thread.sleep(500);}catch(Exception e){} } }
}
