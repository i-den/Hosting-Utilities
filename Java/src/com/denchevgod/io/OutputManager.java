package com.denchevgod.io;

import com.denchevgod.http.HTTPManager;
import com.denchevgod.malware.InfectedUser;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class OutputManager {

    private ConfigManager configManager;

    private String template;

    private HashMap<String, String> replaces;

    List<String> readyTemplates;

    public OutputManager(ConfigManager configManager) throws IOException {
        this.setTemplate();
        this.setReplaces();
        this.configManager = configManager;
        this.readyTemplates = new ArrayList<>();
    }

    private void setReplaces() throws IOException {
        HashMap<String, String> hashMap = new HashMap<>();
        File replacesFile = new File(
                System.getProperty("user.dir") + File.separator + "conf" + File.separator + "replaces.txt"
        );
        BufferedReader reader = new BufferedReader(new FileReader(replacesFile));
        String line;
        while ((line = reader.readLine()) != null) {
            String[] lineTokens = line.split("[\\s]*:[\\s]*");
            if (lineTokens.length != 2) {
                continue;
            }
            hashMap.put(lineTokens[0], lineTokens[1]);
        }
        reader.close();
        this.replaces = hashMap;
    }

    private void setTemplate() throws IOException {
        File templateFile = new File(
                System.getProperty("user.dir") + File.separator + "conf" + File.separator + "template.txt"
        );
        BufferedReader reader = new BufferedReader(new FileReader(templateFile));
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
            stringBuilder.append(System.lineSeparator());
        }
        reader.close();
        this.template = stringBuilder.toString().trim();
    }

    public void createTickets(List<InfectedUser> infectedUsers, String outputDirectory) throws IOException {
        String outputFullDirectory = System.getProperty("user.dir") + File.separator + outputDirectory;
        new File(outputFullDirectory).mkdirs();
        for (InfectedUser infectedUser : infectedUsers) {
            String template = replaceTemplate(infectedUser);
            BufferedWriter currFileToWrite = new BufferedWriter(new FileWriter(
                    String.format("%s/%s-ticket.txt", outputFullDirectory, infectedUser.getcPanelUsername())
            ));
            currFileToWrite.write(template);
            currFileToWrite.close();
        }
    }

    private String replaceTemplate(InfectedUser infectedUser) throws IOException {
        String replacedTemplate = template;
        replacedTemplate = replacedTemplate.replace("##INFECTED_USER_NAME##", infectedUser.getcPanelUsername());
        if (configManager.shouldUsePastebin() && infectedUser.malwareFilesAmt() > configManager.getPastebinTresholdFiles()) {
            replacedTemplate = replacedTemplate.replace("##INFECTED_USER_ALL_FILES##", getPastebinURL(infectedUser));
        } else {
            replacedTemplate = replacedTemplate.replace("##INFECTED_USER_ALL_FILES##", infectedUser.getMalwareFiles());
        }
        for (String replaceKey : replaces.keySet()) {
            replacedTemplate = replacedTemplate.replace(replaceKey, replaces.get(replaceKey));
        }
        return replacedTemplate;
    }

    private String getPastebinURL(InfectedUser infectedUser) throws IOException {
        HTTPManager httpManager = new HTTPManager();
        String apiDevKey = configManager.getAPIDevKey();
        String apiUserKey = configManager.getAPIUserKey();
        String pastePrivate = configManager.getPastePrivate();
        String pasteName = infectedUser.getcPanelUsername() + "-scan";
        String pasteExpireDate = configManager.getExpireDate();
        httpManager.postScanToPastebin(
                apiDevKey,
                apiUserKey,
                infectedUser.getMalwareFiles(),
                pastePrivate,
                pasteName,
                pasteExpireDate
        );
        return null;
    }
}
