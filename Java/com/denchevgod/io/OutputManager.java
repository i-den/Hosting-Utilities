package com.denchevgod.io;

import com.denchevgod.http.PasteEEPoster;
import com.denchevgod.malware.InfectedUser;


import java.io.BufferedWriter;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.File;
import java.io.IOException;
import java.util.Set;

public class OutputManager {

    private OutputManager() {
        throw new AssertionError("Class OutputManager should never be instantiated!");
    }

    public static void createTickets(Set<InfectedUser> infectedUsers) throws IOException {
        String outputFullDirectory = System.getProperty("user.dir") + File.separator + Config.SETTINGS.getOption("outputDirectory");
        int maxScanFiles = (int) Config.SETTINGS.getOption("maxScanFiles");

        new File(outputFullDirectory).mkdirs();
        for (InfectedUser infectedUser : infectedUsers) {
            // Get the template for the current Infected User
            StringBuilder template = replaceDefaultTemplate(
                    infectedUser,
                    maxScanFiles,
                    (String) Config.SETTINGS.getOption("cPanelUserTemplateString"),
                    (String) Config.SETTINGS.getOption("cPanelUserMalwareFilesString")
            );

            // Write the template to a .txt file representing the ticket
            String fileToWriteRealpath = String.format("%s%s%s-ticket.txt", outputFullDirectory, File.separator, infectedUser.getUserName());
            try (BufferedWriter currFileToWrite = new BufferedWriter(new FileWriter(fileToWriteRealpath))) {
                currFileToWrite.write(template.toString().trim());
            } catch (IOException e) {
                throw new IOException("Cannot create the ticket file " + fileToWriteRealpath);
            }
        }
    }

    private static StringBuilder replaceDefaultTemplate(InfectedUser infectedUser,
                                                        int maxScanFiles,
                                                        String templateUserNameToReplace,
                                                        String templateMalwareFilesToReplace)
            throws TemplateFileMissingException {

        // Loading the default Template that should be in the conf/template.txt
        StringBuilder replacedTemplate = loadDefaultTemplate();
        stringBuilderReplaceAll( // Replaces the Infected User Name in the template with the current user's
                replacedTemplate, templateUserNameToReplace, infectedUser.getUserName()
        );

        // Initiate the String that will be used for the Malware files. Either an URL or the files listed
        String malwareListPlaceholderReplacer;
        // Check if a PasteBin site should be used and if so if the Infected User's files exceed the max files to be placed in a .txt file
        if ((boolean) Config.SETTINGS.getOption("usePasteBin") && infectedUser.malwareFilesCount() > maxScanFiles) {
            try { // If it does and we're using a PasteBin site - attempt to post the scans online
                malwareListPlaceholderReplacer = PasteEEPoster.postScanOnline(infectedUser);
                System.out.println("Created a PasteBin ticket for user " + infectedUser.getUserName());
            } catch (Exception e) { // If the scans aren't posted inform the user and create list the files in the ticket
                System.err.println("Ticket for " + infectedUser.getUserName() + " cannot be posted to the PasteBin site. Creating in a ticket file locally");
                malwareListPlaceholderReplacer = infectedUser.listMalwareFiles();
            }
        } else { // Create the ticket by listing the files in it, without using a PasteBin site
            malwareListPlaceholderReplacer = infectedUser.listMalwareFiles();
        }

        // Replace the Malware files String in the template with the User's malware files list
        stringBuilderReplaceAll(
                replacedTemplate, templateMalwareFilesToReplace, malwareListPlaceholderReplacer
        );
        return replacedTemplate;
    }

    /**
     * Returns the ticket template file as a String ready for replacements
     *
     * @return String the ticket template which will have several strings replaced for each ticket
     * @throws TemplateFileMissingException if the template file cannot be loaded
     */
    private static StringBuilder loadDefaultTemplate() throws TemplateFileMissingException {
        // The file should be in the directory /program/conf/template.txt
        String templateFileRealpath = System.getProperty("user.dir") + File.separator + "conf" + File.separator + "template.txt";
        File templateFile = new File(templateFileRealpath);
        try (BufferedReader reader = new BufferedReader(new FileReader(templateFile))) {
            StringBuilder stringBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
                stringBuilder.append(System.lineSeparator());
            }
            return stringBuilder;
        } catch (IOException e) {
            throw new TemplateFileMissingException("The template file should be placed in " + templateFileRealpath, e);
        }
    }

    private static void stringBuilderReplaceAll(StringBuilder builder, String from, String to) {
        int index = builder.indexOf(from);
        while (index != -1) {
            builder.replace(index, index + from.length(), to);
            index += to.length();
            index = builder.indexOf(from, index);
        }
    }

    /**
     * ⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⣠⣤⣶⣶
     * ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⣿⣿⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣀⣀⣾⣿⣿⣿⣿
     * ⣿⣿⣿⣿⣿⡏⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿
     * ⣿⣿⣿⣿⣿⣿⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠁⠀⣿
     * ⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠙⠿⠿⠿⠻⠿⠿⠟⠿⠛⠉⠀⠀⠀⠀⠀⣸⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣴⣿⣿⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⢰⣹⡆⠀⠀⠀⠀⠀⠀⣭⣷⠀⠀⠀⠸⣿⣿⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠈⠉⠀⠀⠤⠄⠀⠀⠀⠉⠁⠀⠀⠀⠀⢿⣿⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⢾⣿⣷⠀⠀⠀⠀⡠⠤⢄⠀⠀⠀⠠⣿⣿⣷⠀⢸⣿⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⡀⠉⠀⠀⠀⠀⠀⢄⠀⢀⠀⠀⠀⠀⠉⠉⠁⠀⠀⣿⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿
     * ⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿
     */
    public static void pikachu() {
        System.out.println(
                "⢀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⣠⣤⣶⣶\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⣿⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣀⣀⣾⣿⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⡏⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠁⠀⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠙⠿⠿⠿⠻⠿⠿⠟⠿⠛⠉⠀⠀⠀⠀⠀⣸⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣴⣿⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⢰⣹⡆⠀⠀⠀⠀⠀⠀⣭⣷⠀⠀⠀⠸⣿⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠈⠉⠀⠀⠤⠄⠀⠀⠀⠉⠁⠀⠀⠀⠀⢿⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⢾⣿⣷⠀⠀⠀⠀⡠⠤⢄⠀⠀⠀⠠⣿⣿⣷⠀⢸⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⡀⠉⠀⠀⠀⠀⠀⢄⠀⢀⠀⠀⠀⠀⠉⠉⠁⠀⠀⣿⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿\n" +
                        "⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿"
        );
    }
}
