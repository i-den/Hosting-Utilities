package com.denchevgod.io;

import com.denchevgod.http.HTTPManager;
import com.denchevgod.malware.InfectedUser;

import java.io.*;
import java.util.List;

public class OutputManager {

    private String template;

    public OutputManager() throws IOException {
        this.setTemplate();
    }

    private void setTemplate() throws IOException {
        File templateFile = new File(System.getProperty("user.dir") + File.separator + "conf" + File.separator + "template.txt");
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

    public void createTickets(List<InfectedUser> infectedUsers) throws IOException {
        String outputFullDirectory =
                System.getProperty("user.dir") + File.separator + Config.getInstance().getConf("outputDirectory");
        new File(outputFullDirectory).mkdirs();
        for (InfectedUser infectedUser : infectedUsers) {
            String template = replaceTemplate(infectedUser);
            BufferedWriter currFileToWrite = new BufferedWriter(new FileWriter(
                    String.format("%s%s%s-ticket.txt", outputFullDirectory, File.separator, infectedUser.getcPanelUsername())
            ));
            currFileToWrite.write(template);
            System.out.println(infectedUser.getcPanelUsername() + " ticket created");
            currFileToWrite.close();
        }
        peeka4oo();
    }

    private String replaceTemplate(InfectedUser infectedUser) throws IOException {
        String replacedTemplate = template;
        replacedTemplate = replacedTemplate.replace("##INFECTED_USER_NAME##", infectedUser.getcPanelUsername());
        if ((boolean) Config.getInstance().getConf("usePastebin")
                && infectedUser.malwareFilesAmt() > (int) Config.getInstance().getConf("maxScanFiles")) {
            replacedTemplate = replacedTemplate.replace("##INFECTED_USER_ALL_FILES##", getPastebinURL(infectedUser));
        } else {
            replacedTemplate = replacedTemplate.replace("##INFECTED_USER_ALL_FILES##", infectedUser.getMalwareFiles());
        }
        return replacedTemplate;
    }

    private String getPastebinURL(InfectedUser infectedUser) throws IOException {
        HTTPManager httpManager = new HTTPManager();
        return httpManager.postScanToPastebin(infectedUser);
    }

    private void peeka4oo() {

    }
}
