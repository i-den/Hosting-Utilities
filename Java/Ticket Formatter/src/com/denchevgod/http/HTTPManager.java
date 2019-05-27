package com.denchevgod.http;

import com.denchevgod.io.Config;
import com.denchevgod.malware.InfectedUser;
import com.google.gson.Gson;

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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HTTPManager {

    public String postScanToPasteEE(InfectedUser infectedUser) throws IOException {
        final URL url = new URL("https://api.paste.ee/v1/pastes");
        HttpURLConnection http = (HttpURLConnection) url.openConnection();

        http.setRequestMethod("POST");
        http.setDoOutput(true);

        Map<String, String> arguments = new HashMap<>();
        arguments.put("description", "A list of infected files");
        arguments.put("key", (String) Config.getInstance().getConf("apiDevKey"));
        arguments.put("sections[0][name]", "Malware Scan - " + infectedUser.getcPanelUsername());
        arguments.put("sections[0][contents]", infectedUser.getMalwareFiles());
        arguments.put("sections[0][syntax]", "text");
        arguments.put("encrypted", "true");

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
            String responseJSON = reader.readLine();
            return new Gson().fromJson(responseJSON, JSONResponse.class).link;
        }
    }

    class JSONResponse {
        String id;
        String link;
    }
}
