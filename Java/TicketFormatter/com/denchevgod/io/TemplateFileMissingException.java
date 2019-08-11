package com.denchevgod.io;

import java.io.IOException;

public class TemplateFileMissingException extends IOException {
    public TemplateFileMissingException(String s, IOException e) {
        super(s, e);
    }
}
