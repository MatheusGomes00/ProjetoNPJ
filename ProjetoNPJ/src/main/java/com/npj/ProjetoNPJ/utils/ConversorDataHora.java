package com.npj.ProjetoNPJ.utils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

public class ConversorDataHora {

    public static Instant convertInstant(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.atZone(ZoneId.systemDefault()).toInstant();
    }

    public static LocalDateTime convertLocalDate(Instant instant) {
        if (instant == null) return null;
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    public static Instant convertStringToInstant(String string) {
        if (string == null) return null;
        return Instant.parse(string);
    }

    public static String converterInstantToString(Instant instant) {
        if (instant == null) return null;
        return instant.toString();
    }
}
