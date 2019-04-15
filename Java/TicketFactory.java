import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class TicketFactory {
    public static void main(String[] args) {
        File chosenLogFileFromInput = FileManager.selectLogFileFromInput();

        if (chosenLogFileFromInput == null) {
            System.out.println(Constants.NO_FILES_IN_CURRENT_WORKING_DIRECTORY);
            System.exit(0);
        }

        try {
            List<InfectedUser> infectedUsers = MalwareLogParser.createMalwareLogs(chosenLogFileFromInput);
            new File(Constants.READY_SCANS_DIR).mkdirs();
            BufferedWriter allUsersFile = new BufferedWriter((new FileWriter(
                    String.format("%s/all-users.txt", Constants.READY_SCANS_DIR)
            )));
            for (InfectedUser infectedUser : infectedUsers) {
                String ticketTemplate = TicketTemplater.getTicketTemplate(infectedUser);
                BufferedWriter currFileToWrite = new BufferedWriter(new FileWriter(
                        String.format("%s/%s-ticket.txt", Constants.READY_SCANS_DIR, infectedUser.getName())
                ));
                currFileToWrite.write(ticketTemplate);
                currFileToWrite.close();
            }
            allUsersFile.write(infectedUsers.stream().map(InfectedUser::getName).collect(Collectors.joining(System.lineSeparator())));
            allUsersFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class FileManager {
    static File selectLogFileFromInput() {
        Scanner scanner = new Scanner(System.in);

        File workingDir = new File(Constants.WORKING_DIR);
        File[] workingDirFilesAndDirs = workingDir.listFiles();
        if (workingDirFilesAndDirs == null) {
            return null;
        }

        File[] dirFilesOnly = Arrays.stream(workingDirFilesAndDirs).filter(f -> !f.isDirectory()).toArray(File[]::new);
        if (dirFilesOnly.length == 0) {
            return null;
        }

        System.out.println("Select the number of the Malware Scan file");
        int malwareScanFileIndexFromInput = -1;
        for (int i = 0; i < dirFilesOnly.length; i++) {
            System.out.printf("[%d] %s%n", i + 1, dirFilesOnly[i].getName());
        }
        malwareScanFileIndexFromInput += Integer.parseInt(scanner.nextLine());

        return dirFilesOnly[malwareScanFileIndexFromInput];
    }
}

class MalwareLogParser {
    static List<InfectedUser> createMalwareLogs(File logFile) throws IOException {
        BufferedReader malwareLogReader = new BufferedReader(new FileReader(logFile.toString()));
        Pattern cPanelUserAndInfectedFileRegEx = Pattern.compile(Constants.VALID_LINE_REGEX);
        List<InfectedUser> infectedUsers = new ArrayList<>();

        String fullMalwareLogLine;
        ValidateLogEntry validateLogEntry = new ValidateLogEntry();
        while ((fullMalwareLogLine = malwareLogReader.readLine()) != null) {
            if (!fullMalwareLogLine.matches(Constants.VALID_LINE_REGEX)) {
                continue;
            }

            Matcher matcher = cPanelUserAndInfectedFileRegEx.matcher(fullMalwareLogLine);
            if (matcher.matches()) {
                String infectedFileFullPath = matcher.group("infectedFileFullPath");
                if (validateLogEntry.logLineIsValid(infectedFileFullPath)) {
                    String name = matcher.group("user");
                    String infectedFile = matcher.group("infectedFile");

                    InfectedUser currInfectedUser = InfectedUser.findUserInListByName(infectedUsers, name);
                    if (currInfectedUser != null) {
                        currInfectedUser.addInfectedFile(infectedFile);
                    } else {
                        currInfectedUser = new InfectedUser(name);
                        currInfectedUser.addInfectedFile(infectedFile);
                        infectedUsers.add(currInfectedUser);
                    }
                }
            }
        }

        return infectedUsers;
    }
}

class InfectedUser {
    private String name;
    private List<String> infectedFiles;

    InfectedUser(String name) {
        this.name = name;
        infectedFiles = new ArrayList<>();
    }

    static InfectedUser findUserInListByName(List<InfectedUser> infectedUsers, String nameToSearchFor) {
        for (InfectedUser infectedUser : infectedUsers) {
            if (infectedUser.getName().equals(nameToSearchFor)) {
                return infectedUser;
            }
        }
        return null;
    }

    String getName() {
        return name;
    }

    void setName(String name) {
        this.name = name;
    }

    List<String> getInfectedFiles() {
        return infectedFiles;
    }

    void addInfectedFile(String infectedFile) {
        infectedFiles.add(infectedFile);
    }
}

class ValidateLogEntry {
    private List<String> invalidBeginsWithStrings;
    private List<String> invalidEndsWithStrings;
    private List<String> invalidContainsStrings;

    ValidateLogEntry() {
        invalidBeginsWithStrings = new ArrayList<>();
        invalidEndsWithStrings = new ArrayList<>();
        invalidContainsStrings = new ArrayList<>();

        // addInvalidLogLineToBeginWith();

        addInvalidLogLineToEndWith(".apk");
        addInvalidLogLineToEndWith(".apk");
        addInvalidLogLineToEndWith(".wpress");
        addInvalidLogLineToEndWith(".gz");
        addInvalidLogLineToEndWith(".tgz");
        addInvalidLogLineToEndWith(".tar.gz");
        addInvalidLogLineToEndWith(".zip");

        addInvalidLogLineContainsString("/quarantine_clamavconnector/");
        addInvalidLogLineContainsString("/.cagefs/");

    }

    void addInvalidLogLineToBeginWith(String invalidBeginWithString) {
        invalidBeginsWithStrings.add(invalidBeginWithString);
    }

    void addInvalidLogLineToEndWith(String invalidEndsWithString) {
        invalidEndsWithStrings.add(invalidEndsWithString);
    }

    void addInvalidLogLineContainsString(String invalidContainsString) {
        invalidContainsStrings.add(invalidContainsString);
    }

    boolean logLineIsValid(String logLine) {
        for (String invalidBeginsWithString : invalidBeginsWithStrings) {
            if (logLine.startsWith(invalidBeginsWithString)) {
                return false;
            }
        }

        for (String invalidEndsWithString : invalidEndsWithStrings) {
            if (logLine.endsWith(invalidEndsWithString)) {
                return false;
            }
        }

        for (String invalidContainsString : invalidContainsStrings) {
            if (logLine.contains(invalidContainsString)) {
                return false;
            }
        }

        return true;
    }
}

class TicketTemplater {

    private static String baseTemplate =
            "Hello,\n" +
                    "\n" +
                    "I am writing this to inform you that we've detected a vast amount of infected files in your cPanel account with username INFECTED_USER_NAME.\n" +
                    "\n" +
                    "We have run a malware scan and the results are listed below\n" +
                    "\n" +
                    "```\n" +
                    "INFECTED_USER_ALL_FILES\n" +
                    "```\n\n" +
                    "You should carefully examine those files and how they interact with your installations. Most of them contain malicious (also known as obfuscated) code, giving third parties (hackers) access to your account's resources which they use for illegal activities such as:\n" +
                    "\n" +
                    "-- Mass distribution of illegal spam\n" +
                    "-- DDoS attacks from your account\n" +
                    "-- Phishing\n" +
                    "\n" +
                    "In addition to this, the third parties also have access to your installations' data which is a major security issue for any personal information that you might store.\n" +
                    "\n" +
                    "That is why is crucial for you to go through all of those files and make sure that they're clean. As this is a major issue for the server's shared usage we ask for your assistance in resolving this issue as fast as possible.\n" +
                    "\n" +
                    "I would strongly advise that in addition to cleaning your cPanel account's files that you run a virus scanner locally, on your computer and make sure it's not infected. After that a good practice is to change all of your hosting account's passwords:\n" +
                    "\n" +
                    "-- Your cPanel account's password\n" +
                    "-- Your email account's passwords\n" +
                    "-- Your FTP account's password\n" +
                    "\n" +
                    "You should also read our article on the matter from https://www.webhostface.com/kb/knowledgebase/cleaning-up-infected-websites/\n" +
                    "\n" +
                    "We're expecting to hear your state and what actions have been taken within the next 24 hours. Otherwise, you risk having your account suspended until further action is taken.";


    static String getTicketTemplate(InfectedUser infectedUser) {
        return baseTemplate
                .replace("INFECTED_USER_NAME", infectedUser.getName())
                .replace("INFECTED_USER_ALL_FILES", String.join(System.lineSeparator(), infectedUser.getInfectedFiles()));
    }

}

class Constants {
    static final String NO_FILES_IN_CURRENT_WORKING_DIRECTORY = "No files in the current directory";

    static final String VALID_LINE_REGEX = "(?<infectedFileFullPath>/(?<home>home)/(?<user>.*?)(?<infectedFile>/.*?))(?<separator>:\\s)(?<infectedType>.*)";

    static final String WORKING_DIR = System.getProperty("user.dir");

    static final String READY_SCANS_DIR = String.format("%s/scans", WORKING_DIR);
}

