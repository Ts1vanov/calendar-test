import { Component } from '@angular/core';
import 'add-to-calendar-button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'calendar-test';

  mockCalendarData = {
    title: 'Test title',
    startDate: '20240523T090000Z',
    endDate: '20240523T100000Z',
    repeat: 'RRULE:FREQ=WEEKLY;COUNT=10',
    alert: [
      {
        trigger: '-PT5H',
        action: 'DISPLAY',
        description: 'Reminder',
      },
      {
        trigger: '-PT15M',
        action: 'DISPLAY',
        description: 'Reminder',
      },
    ],
    url: 'https://example.com',
    attachments: [
      {
        type: 'application/pdf',
        url: 'https://example.com/document.pdf',
      },
      {
        type: 'image/png',
        url: 'https://example.com/image.png',
      },
    ],
    notes: 'Some test note.',
  };

  generateICSFile() {
    const {
      title,
      startDate,
      endDate,
      repeat,
      alert,
      url: eventUrl,
      attachments,
      notes,
    } = this.mockCalendarData;

    let alerts = '';
    alert.forEach((al) => {
      alerts += `BEGIN:VALARM\nTRIGGER:${al.trigger}\nACTION:${al.action}\nDESCRIPTION:${al.description}\nEND:VALARM\n`;
    });

    let attachmentsStr = '';
    attachments.forEach((att) => {
      attachmentsStr += `ATTACH;FMTTYPE=${att.type}:${att.url}\n`;
    });

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
LOCATION:${eventUrl}
DESCRIPTION:${notes}
DTSTART:${startDate}
DTEND:${endDate}
${repeat}
${alerts.trim()}
${attachmentsStr.trim()} 
END:VEVENT
END:VCALENDAR`.trim(); // Trim any leading/trailing whitespace from the entire content

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event.ics';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  generateGoogleCalendarLink() {
    const { title, startDate, endDate, notes } = this.mockCalendarData;

    // Encode event details to be used in the URL
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(notes || '');
    const encodedStartDate = startDate.replace(/[-:]/g, '');
    const encodedEndDate = endDate.replace(/[-:]/g, '');

    // Construct the Google Calendar event URL
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${encodedStartDate}/${encodedEndDate}&details=${encodedDescription}`;

    // Open the URL in a new tab
    window.open(calendarUrl, '_blank');
  }
}
