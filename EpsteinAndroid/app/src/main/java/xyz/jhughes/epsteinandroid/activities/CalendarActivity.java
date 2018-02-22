package xyz.jhughes.epsteinandroid.activities;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.graphics.RectF;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.DatePicker;
import android.widget.Toast;

import com.alamkanak.weekview.MonthLoader;
import com.alamkanak.weekview.WeekView;
import com.alamkanak.weekview.WeekViewEvent;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

import butterknife.BindView;
import butterknife.ButterKnife;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import xyz.jhughes.epsteinandroid.R;
import xyz.jhughes.epsteinandroid.models.Events.Event;
import xyz.jhughes.epsteinandroid.models.Events.Events;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class CalendarActivity extends AppCompatActivity implements WeekView.EventClickListener, MonthLoader.MonthChangeListener, DatePickerDialog.OnDateSetListener {

    @BindView(R.id.weekView)
    WeekView weekView;

    ProgressDialog dialog;

    Events events;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        ButterKnife.bind(this);

        weekView.setOnEventClickListener(this);
        weekView.setMonthChangeListener(this);

        dialog = ProgressDialog.show(this, "", "Loading your calendar. Please wait...", true);
        dialog.show();

        EpsteinApiHelper.getInstance().getEvents(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null)
        ).enqueue(new Callback<Events>() {
            @Override
            public void onResponse(Call<Events> call, Response<Events> response) {
                System.out.println(response.body());
                dialog.cancel();

                weekView.notifyDatasetChanged();
            }

            @Override
            public void onFailure(Call<Events> call, Throwable t) {
                t.printStackTrace();
                dialog.cancel();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.calendar, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.date:
                final Calendar c = Calendar.getInstance();
                int year = c.get(Calendar.YEAR);
                int month = c.get(Calendar.MONTH);
                int day = c.get(Calendar.DAY_OF_MONTH);

                // Create a new instance of DatePickerDialog and return it
                new DatePickerDialog(this, this, year, month, day).show();

                break;
            case R.id.advice:

                break;
            case R.id.import_calendar:

                break;
            case R.id.rate_events:

                break;
            default:
                //Nothing
        }

        return true;
    }

    @Override
    public List<? extends WeekViewEvent> onMonthChange(int newYear, int newMonth) {

        // Populate the week view with some events.
        List<WeekViewEvent> events = new ArrayList<WeekViewEvent>();

        if (this.events == null) {
            Toast.makeText(this, "Looks like nothing was returned by the server or there was an error.", Toast.LENGTH_LONG).show();

            // For debugging purposes
            Calendar startTime = Calendar.getInstance();
            startTime.set(Calendar.HOUR_OF_DAY, 3);
            startTime.set(Calendar.MINUTE, 0);
            startTime.set(Calendar.MONTH, newMonth - 1);
            startTime.set(Calendar.YEAR, newYear);

            Calendar endTime = (Calendar) startTime.clone();
            endTime.add(Calendar.HOUR, 1);
            endTime.set(Calendar.MONTH, newMonth - 1);

            WeekViewEvent event = new WeekViewEvent("First", "Test Event", startTime, endTime);
            event.setColor(getResources().getColor(R.color.colorPrimary));
            events.add(event);

            return events;
        }

        if (this.events.items.size() == 0) {
            Toast.makeText(this, "Looks like you don't have anything! Stress free!", Toast.LENGTH_LONG).show();

            return events;
        }

        for (Event event : this.events.items) {
            // ---------------------------------------------------------------------------
            // Start time for event
            // ---------------------------------------------------------------------------

            Calendar startTimeCal = Calendar.getInstance();
            startTimeCal.setTimeZone(TimeZone.getTimeZone(event.start.timeZone));

            String[] startTimes = event.start.dateTime.split("T");

            // Date
            String startDate = startTimes[0];
            startTimeCal.setTime(Date.valueOf(startDate));

            // Time
            String[] timeForStart = startTimes[1].split(":");

            startTimeCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(timeForStart[0]));
            startTimeCal.set(Calendar.MINUTE, Integer.parseInt(timeForStart[1]));

            // ---------------------------------------------------------------------------
            // End start time for event
            // ---------------------------------------------------------------------------
            // End time for event
            // ---------------------------------------------------------------------------

            Calendar endTimeCal = Calendar.getInstance();
            endTimeCal.setTimeZone(TimeZone.getTimeZone(event.start.timeZone));

            String[] endTimes = event.start.dateTime.split("T");

            // Date
            String endDate = endTimes[0];
            endTimeCal.setTime(Date.valueOf(endDate));

            // Time
            String[] timeForEnd = endTimes[1].split(":");

            endTimeCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(timeForEnd[0]));
            endTimeCal.set(Calendar.MINUTE, Integer.parseInt(timeForEnd[1]));

            // ---------------------------------------------------------------------------
            // End end time for event
            // ---------------------------------------------------------------------------

            WeekViewEvent calendarEventToAdd = new WeekViewEvent(event.id, event.summary, startTimeCal, endTimeCal);
            calendarEventToAdd.setColor(getResources().getColor(R.color.colorPrimary));
            events.add(calendarEventToAdd);
        }

        return events;
    }

    @Override
    public void onEventClick(WeekViewEvent event, RectF eventRect) {
        // Nothing yet!
    }

    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month, dayOfMonth);
        weekView.goToDate(calendar);
    }
}
