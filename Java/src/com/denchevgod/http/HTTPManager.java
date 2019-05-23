package com.denchevgod.http;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class HTTPManager {

    public String postScanToPastebin(String devKey,
                                     String userKey,
                                     String pasteCode,
                                     String pastePrivate,
                                     String pasteName,
                                     String pasteExpireDate) throws IOException {
        URL url = new URL("https://pastebin.com/api/api_post.php");
        URLConnection urlConnection = url.openConnection();
        HttpURLConnection http = (HttpURLConnection) urlConnection;
        http.setRequestMethod("POST"); // PUT is another valid option
        http.setDoOutput(true);


        return null;
    }
}
