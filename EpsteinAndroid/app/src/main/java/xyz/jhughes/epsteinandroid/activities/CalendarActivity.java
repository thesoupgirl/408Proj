package xyz.jhughes.epsteinandroid.activities;

import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.RectF;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.DatePicker;
import android.widget.Toast;

import com.alamkanak.weekview.MonthLoader;
import com.alamkanak.weekview.WeekView;
import com.alamkanak.weekview.WeekViewEvent;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import xyz.jhughes.epsteinandroid.R;
import xyz.jhughes.epsteinandroid.models.Advice;
import xyz.jhughes.epsteinandroid.models.Events.Event;
import xyz.jhughes.epsteinandroid.models.Events.Events;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class CalendarActivity extends AppCompatActivity implements WeekView.EventClickListener, MonthLoader.MonthChangeListener, DatePickerDialog.OnDateSetListener {

    @BindView(R.id.weekView)
    WeekView weekView;

    ProgressDialog dialog;

    Events events;

    public static final int IMPORTED_CALENDAR = 280;
    public static final int FAILED_IMPORT_CALENDAR = 281;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        ButterKnife.bind(this);

        weekView.setOnEventClickListener(this);
        weekView.setMonthChangeListener(this);

        getCalendarDataAndUpdateUi();
    }

    private void getCalendarDataAndUpdateUi() {
        dialog = ProgressDialog.show(this, "", "Loading your calendar. Please wait...", true);
        dialog.show();

        EpsteinApiHelper.getInstance().getEvents(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null)
        ).enqueue(new Callback<Events>() {
            @Override
            public void onResponse(Call<Events> call, Response<Events> response) {
                dialog.cancel();

                if (response.body() == null || response.code() != 200) {
                    Toast.makeText(getApplicationContext(), "We had trouble getting your calendar", Toast.LENGTH_LONG).show();
                    return;
                }

                CalendarActivity.this.events = response.body();

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
                getAndDisplayAdvice();
                break;
            case R.id.import_calendar:
                startActivityForResult(new Intent(this, CalendarImportActivity.class), IMPORTED_CALENDAR);
                break;
            case R.id.rate_events:
                if (events.items.size() == 0) {
                    Toast.makeText(this, "You don't have any events to rate", Toast.LENGTH_LONG).show();
                    break;
                }
                Intent i = new Intent(this, EventRatingActivity.class);
                i.putExtra("events", events);
                startActivity(i);
                break;
            default:
                //Nothing
        }

        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == IMPORTED_CALENDAR) {
            getCalendarDataAndUpdateUi();
        }
    }

    @Override
    public List<? extends WeekViewEvent> onMonthChange(int newYear, int newMonth) {

        // Populate the week view with some events.
        List<WeekViewEvent> events = new ArrayList<>();

        if (this.events == null || this.events.items.size() == 0 || this.events.items.size() == 0) {
            return events;
        }

        for (Event event : this.events.items) {
            // ---------------------------------------------------------------------------
            // Start time for event
            // ---------------------------------------------------------------------------

            if (event.start.dateTime == null || event.end.dateTime == null) {
                continue;
            }

            // Splitting date from time
            String[] startTimes = event.start.dateTime.split("T");

            // Date
            String[] startDate = startTimes[0].split("-");

            // Time
            String[] timeForStart = startTimes[1].split(":");

            // ---------------------------------------------------------------------------
            // End start time for event
            // ---------------------------------------------------------------------------
            // End time for event
            // ---------------------------------------------------------------------------

            // Splitting date from time
            String[] endTimes = event.end.dateTime.split("T");

            // Date
            String[] endDate = endTimes[0].split("-");

            // Time
            String[] timeForEnd = endTimes[1].split(":");

            // ---------------------------------------------------------------------------
            // End end time for event
            // ---------------------------------------------------------------------------

            WeekViewEvent calendarEventToAdd = new WeekViewEvent(event.id, event.summary,
                    Integer.valueOf(startDate[0]), Integer.valueOf(startDate[1]), Integer.valueOf(startDate[2]), // Start date
                    Integer.parseInt(timeForStart[0]), Integer.parseInt(timeForStart[1]),                        // Start time
                    Integer.valueOf(endDate[0]), Integer.valueOf(endDate[1]), Integer.valueOf(endDate[2]),       // End date
                    Integer.parseInt(timeForEnd[0]), Integer.parseInt(timeForEnd[1])                             // End time
            );

            if (event.stressValue > 0) {
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositiveStressLevel));
            } else if (event.stressValue < 0) {
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegativeStressLevel));
            } else {
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorZeroStressLevel));
            }

            events.add(calendarEventToAdd);
        }

        return events;
    }

    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month, dayOfMonth);
        weekView.goToDate(calendar);
    }

    @Override
    public void onEventClick(WeekViewEvent event, RectF eventRect) {
        // Nothing yet!
    }

    private void getAndDisplayAdvice() {
        EpsteinApiHelper.getInstance().getAdvice(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null)
        ).enqueue(new Callback<Advice>() {
            @Override
            public void onResponse(Call<Advice> call, Response<Advice> response) {
                if (response.body() != null && response.code() == 200) {
                    advicePopup(response.body().advice);
                } else {
                    advicePopup("You are awesome and can do whatever you set your mind to!");
                }
            }

            @Override
            public void onFailure(Call<Advice> call, Throwable t) {
                advicePopup("You are awesome and can do whatever you set your mind to!");
            }
        });
    }

    private void advicePopup(String message) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        alertDialogBuilder.setTitle("Dose of Advice");
        alertDialogBuilder.setMessage(message);
        alertDialogBuilder.setCancelable(false);
        alertDialogBuilder.setPositiveButton("Woohoo!", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
            }
        });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }
}
