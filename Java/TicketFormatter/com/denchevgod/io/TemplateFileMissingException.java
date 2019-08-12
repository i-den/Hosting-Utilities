package com.denchevgod.io;

import java.io.IOException;

class TemplateFileMissingException extends IOException {
    TemplateFileMissingException(String s, IOException e) {
        super(s, e);
    }
}
