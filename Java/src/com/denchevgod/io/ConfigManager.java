package com.denchevgod.io;

import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

public class ConfigManager {

    HashMap<String, Object> configMap;

    public void loadConfigFile() throws IOException {
        File configFile = new File(
                System.getProperty("user.dir") + File.separator + "conf" + File.separator + "config.yaml"
        );
        Yaml yaml = new Yaml();
        this.configMap = yaml.load(new FileReader(configFile));
    }

    public ArrayList<String> getProhibitedBeginsWithWords() {
        return (ArrayList<String>) configMap.get("beginsWith");
    }

    public ArrayList<String> getProhibitedContainsWords() {
        return (ArrayList<String>) configMap.get("contains");
    }

    public ArrayList<String> getProhibitedEndsWithWords() {
        return (ArrayList<String>) configMap.get("endsWith");
    }

    public boolean shouldUsePastebin() {
        return (boolean) configMap.get("usePastebin");
    }

    public String getOutputDirectory() {
        return (String) configMap.get("outputDirectory");
    }

    public String getAPIDevKey() {
        return (String) configMap.get("apiDevKey");
    }

    public String getAPIUserKey() {
        return (String) configMap.get("apiUserKey");
    }

    public String getPastePrivate() {
        return (String) configMap.get("pastePrivate");
    }

    public int getPastebinTresholdFiles() {
        return (int) configMap.get("maxScanFiles");
    }

    public String getExpireDate() {
        return (String) configMap.get("expiry");
    }
}
