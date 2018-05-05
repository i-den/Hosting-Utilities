#!/bin/bash

LOG_DIR="public_html_cron_logs"

DAY=`date +"%d-%m-%Y"`
HOUR=`date "+%H-%M"`

if [ ! -d /home/$USER/$LOG_DIR/$DAY ]; then
    mkdir /home/$USER/$LOG_DIR/$DAY;
fi

CREATE_DIR=/home/$USER/$LOG_DIR/$DAY
GET_LOG=$CREATE_DIR/$HOUR-GET.log
POST_LOG=$CREATE_DIR/$HOUR-POST.log
MODIFIED_FILES_LOG=$CREATE_DIR/$HOUR-MODIFIED.log

find ~/ -type f -mmin -60 > $MODIFIED_FILES_LOG

while read line; do

    DATE_LOG=`echo $line | awk '{print $4}'`; DATE_LOG=${DATE_LOG:1}
    MONTH_VERB=`echo $DATE_LOG | awk -F '[/:]' '{print $2}'`
    
    if [ "$MONTH_VERB" = "January" ]; then
        MONTH=01
    elif [ "$MONTH_VERB" = "February" ]; then
        MONTH=02
    elif [ "$MONTH_VERB" = "March" ]; then
        MONTH=03
    elif [ "$MONTH_VERB" = "April" ]; then
        MONTH=04
    elif [ "$MONTH_VERB" = "May" ]; then
        MONTH=05
    elif [ "$MONTH_VERB" = "June" ]; then
        MONTH=06
    elif [ "$MONTH_VERB" = "July" ]; then
        MONTH=07
    elif [ "$MONTH_VERB" = "August" ]; then
        MONTH=08
    elif [ "$MONTH_VERB" = "September" ]; then
        MONTH=09
    elif [ "$MONTH_VERB" = "October" ]; then
        MONTH=10
    elif [ "$MONTH_VERB" = "November" ]; then
        MONTH=11
    elif [ "$MONTH_VERB" = "December" ]; then
        MONTH=12
    fi
    
    UNIX_DATE=`echo $DATE_LOG | awk -v AWK_MONTH="$MONTH" -F '[/:]' '{print $3"-"AWK_MONTH"-"$1" "$4":"$5":"$6}'`
    UNIX_TIMESTAMP_LOG=`date -d "$UNIX_DATE" "+%s"`
    UNIX_TIMESTAMP_LAST_HOUR=`date -d '60 min ago' "+%s"`
    
    if  [ $UNIX_TIMESTAMP_LOG -gt $UNIX_TIMESTAMP_LAST_HOUR ]; then
        if [[ $line = *"GET"* ]]; then
            echo $line | awk '{print $1}' >> $GET_LOG
        else
            echo $line | awk '{print $1}' >> $POST_LOG
        fi
    fi
    
done < ~/access-logs/denchevtest.tk-ssl_log

cat $GET_LOG | sort | uniq >> $GET_LOG-tmp
mv $GET_LOG{-tmp,}

cat $POST_LOG | sort | uniq >> $POST_LOG-tmp
mv $POST_LOG{-tmp,}
