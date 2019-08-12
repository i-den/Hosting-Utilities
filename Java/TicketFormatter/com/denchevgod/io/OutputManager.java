package com.denchevgod.io;

import com.denchevgod.http.PasteEEPoster;
import com.denchevgod.malware.InfectedUser;


import java.io.BufferedWriter;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.File;
import java.io.IOException;
import java.util.*;

public class OutputManager {

    private OutputManager() {
        throw new AssertionError("Class OutputManager should never be instantiated!");
    }

    /**
     *
     * Creates a ticket template file for each InfectedUser and stores it on the file system
     *
     * @param infectedUsers A set of InfectedUser objects that contain each User's name and its list of infected files
     * @throws IOException if it cannot create a ticket file, the file is created in
     * /program/root/dir/${outputDirectory}/user-ticket.txt
     */
    public static void createTickets(Set<InfectedUser> infectedUsers) throws IOException {
        String outputFullDirectory = System.getProperty("user.dir") + File.separator + Config.SETTINGS.getOption("outputDirectory");
        int maxScanFiles = (int) Config.SETTINGS.getOption("maxScanFiles");

        new File(outputFullDirectory).mkdirs(); // Try to make the output directory if it's not created yet
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
        OutputNotifier.notifyTicketOutcome();
    }

    /**
     *
     * Replaces the default template with the Infected User's specific information (User Name and Scanned Files)
     *
     * @param infectedUser the Infected User object whose information will be used in the template
     * @param maxScanFiles the amount of maximum scanned files that should be present,
     *                     if above this number - a PasteBin site will be used
     * @param templateUserNameToReplace the String used in the template that will be replaced with the Infected User object's User Name
     * @param templateMalwareFilesToReplace the String that will be replaced with the Infected User object's scanned files
     * @return the replaced template in a StringBuilder object
     * @throws TemplateFileMissingException if the template file located at /program/root/dir/conf/template.txt is missing
     */
    private static StringBuilder replaceDefaultTemplate(InfectedUser infectedUser,
                                                        int maxScanFiles,
                                                        String templateUserNameToReplace,
                                                        String templateMalwareFilesToReplace)
            throws TemplateFileMissingException {

        // Loading the default Template that should be in the conf/template.txt
        StringBuilder template = loadDefaultTemplate();
        stringBuilderReplaceAll( // Replaces the Infected User Name in the template with the current user's
                template, templateUserNameToReplace, infectedUser.getUserName()
        );

        // Initiate the String that will be used for the Malware files. Either an URL or the files listed
        String malwareListPlaceholderReplacer;
        // Check if a PasteBin site should be used and if so if the Infected User's files exceed the max files to be placed in a .txt file
        if ((boolean) Config.SETTINGS.getOption("usePasteBin") && infectedUser.malwareFilesCount() > maxScanFiles) {
            try { // If it does and we're using a PasteBin site - attempt to post the scans online
                malwareListPlaceholderReplacer = PasteEEPoster.postScanOnline(infectedUser);
                OutputNotifier.pasteBinNormals.put(infectedUser.getUserName(), infectedUser.malwareFilesCount());
            } catch (Exception e) { // If the scans aren't posted inform the user and create list the files in the ticket
                malwareListPlaceholderReplacer = infectedUser.listMalwareFiles();
                OutputNotifier.pasteBinErrors.put(infectedUser.getUserName(), infectedUser.malwareFilesCount());
            }
        } else { // Create the ticket by listing the files in it, without using a PasteBin site
            malwareListPlaceholderReplacer = infectedUser.listMalwareFiles();
            OutputNotifier.normals.put(infectedUser.getUserName(), infectedUser.malwareFilesCount());
        }

        // Replace the Malware files String in the template with the User's malware files list
        stringBuilderReplaceAll(
                template, templateMalwareFilesToReplace, malwareListPlaceholderReplacer
        );
        return template;
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
     * Simple class grouping System.out messages
     */
    private static class OutputNotifier {
        static Map<String, Integer>  pasteBinErrors = new HashMap<>();
        static Map<String, Integer>  pasteBinNormals = new HashMap<>();
        static Map<String, Integer>  normals = new HashMap<>();

        static void notifyTicketOutcome() {
            notifyTicketOutcome(pasteBinErrors, "PasteBin Tickets that didn't get created due to errors:");
            notifyTicketOutcome(pasteBinNormals, "PasteBin Created Tickets");
            notifyTicketOutcome(normals, "Normal Tickets");
        }

        static void notifyTicketOutcome(Map<String, Integer> map, String msg) {
            if (!map.isEmpty()) {
                System.out.println(msg);
                map.entrySet().stream()
                        .sorted(((o1, o2) -> { // 1st by Val - Desc, then by Key - Asc
                            int valCmp = o2.getValue().compareTo(o1.getValue());
                            if (valCmp == 0) {
                                return o1.getKey().compareTo(o2.getKey());
                            }
                            return valCmp;
                        })) // 16 - cPanel max name len
                        .forEach(e -> System.out.printf("|%16s - %-4d|%n", e.getKey(), e.getValue()));
            }
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
