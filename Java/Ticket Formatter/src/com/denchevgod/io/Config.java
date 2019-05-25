package com.denchevgod.io;

import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;

public class Config {

    private static Config ourInstance = new Config();

    public static Config getInstance() {
        return ourInstance;
    }

    private Config() {}

    private HashMap<String, Object> configMap;

    public static void loadConfig() throws FileNotFoundException {
        Yaml yaml = new Yaml();
        ourInstance.configMap = yaml.load(new FileReader(new File(
                System.getProperty("user.dir") + File.separator + "conf" + File.separator + "config.yaml"
        )));
    }

    @SuppressWarnings("unchecked")
    public ArrayList<String> getProhibitedWords(String words) {
        return (ArrayList<String>) configMap.get(words);
    }

    public Object getConf(String confName) {
        return configMap.get(confName);
    }
}
