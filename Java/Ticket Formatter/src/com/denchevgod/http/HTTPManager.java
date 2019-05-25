package com.denchevgod.http;

import com.denchevgod.io.Config;
import com.denchevgod.malware.InfectedUser;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

public class HTTPManager {

    public String postScanToPastebin(InfectedUser infectedUser) throws IOException {
        final URL url = new URL("https://pastebin.com/api/api_post.php");
        HttpURLConnection http = (HttpURLConnection) url.openConnection();

        http.setRequestMethod("POST");
        http.setDoOutput(true);

        Map<String, String> arguments = new HashMap<>();
        arguments.put("api_option", "paste");
        arguments.put("api_dev_key", (String) Config.getInstance().getConf("apiDevKey"));
        arguments.put("api_paste_name", "Scan - " + infectedUser.getcPanelUsername());
        arguments.put("api_paste_expire_date", (String) Config.getInstance().getConf("expiry"));
        arguments.put("api_paste_code", infectedUser.getMalwareFiles());
        arguments.put("api_paste_private", "0");
        arguments.put("api_user_key", (String) Config.getInstance().getConf("apiUserKey"));

        StringJoiner sj = new StringJoiner("&");
        for (Map.Entry<String, String> entry : arguments.entrySet())
            sj.add(URLEncoder.encode(entry.getKey(), "UTF-8") + "="
                    + URLEncoder.encode(entry.getValue(), "UTF-8"));
        byte[] out = sj.toString().getBytes(StandardCharsets.UTF_8);
        int length = out.length;

        http.setFixedLengthStreamingMode(length);
        http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        http.connect();
        try (OutputStream os = http.getOutputStream()) {
            os.write(out);
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(http.getInputStream()))) {
            return reader.readLine();
        }
    }
}
