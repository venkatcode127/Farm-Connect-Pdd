package com.farmconnect.automation.pages;

import io.appium.java_client.android.AndroidDriver;

/** ChatPage - Page Object for AI Assistant chat. */
public class ChatPage extends BasePage {
    public ChatPage(AndroidDriver driver) { super(driver); }

    public boolean isChatButtonPresent() { return elementExists(".ai-chat-btn, #aiChatBtn, .chat-float"); }
    public void openChat() { clickByCss(".ai-chat-btn, #aiChatBtn, .chat-float"); pause(1000); }
    public boolean isChatWindowOpen() { return isVisible(".chat-window, .chat-panel, #chatWindow"); }
    public void sendMessage(String msg) {
        executeScript("var el=document.querySelector('.chat-input input, #chatInput, .chat-message-input');" +
            "if(el){el.value='" + msg.replace("'", "\\'") + "';el.dispatchEvent(new Event('input',{bubbles:true}));}");
        clickByCss(".chat-send, #chatSend, .send-btn");
        pause(2000);
    }
    public int getMessageCount() { return getElementCount(".chat-message, .message-bubble"); }
    public void closeChat() { clickByCss(".chat-close, .close-chat, #closeChatBtn"); pause(500); }
    public String getLastBotMessage() {
        try {
            Object r = executeScript("var msgs=document.querySelectorAll('.bot-message,.ai-message');return msgs.length?msgs[msgs.length-1].textContent.trim():'';");
            return r != null ? r.toString() : "";
        } catch (Exception e) { return ""; }
    }
}
