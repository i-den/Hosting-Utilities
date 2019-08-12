package com.denchevgod;


import com.denchevgod.io.InputManager;
import com.denchevgod.io.OutputManager;
import com.denchevgod.io.NoFilesInDirectoryException;
import com.denchevgod.malware.InfectedUser;
import com.denchevgod.malware.MalwareManager;

import java.io.File;
import java.io.IOException;
import java.util.Set;

public class TicketParser {

    public static void main(String[] args) {
        try {
            File scanFile = InputManager.getScanFileFromUserInput();
            Set<InfectedUser> infectedUsers = MalwareManager.getInfectedUsersFromScanFile(scanFile);
            OutputManager.createTickets(infectedUsers);
        } catch (NoFilesInDirectoryException | IOException e) {
            System.err.println(e.getMessage());
        }
    }
}
