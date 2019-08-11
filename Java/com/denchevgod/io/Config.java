package com.denchevgod.io;

import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;


public enum Config {
    SETTINGS;

    private HashMap<String, Object> configMap;

    Config() {
        String configFileRealPath = System.getProperty("user.dir") + File.separator + "conf" + File.separator + "config.yaml";
        try {
            configMap = new Yaml().load(new FileReader(new File(
                    configFileRealPath
            )));
        } catch (FileNotFoundException e) {
            System.err.println("Configuration file was not found. The file should be in the path: \n" + configFileRealPath);
            System.exit(-1);
        }
    }

    public Object getOption(String optName) {
        return configMap.get(optName);
    }
}
