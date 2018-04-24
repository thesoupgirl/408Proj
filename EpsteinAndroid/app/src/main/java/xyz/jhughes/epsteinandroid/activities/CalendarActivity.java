package xyz.jhughes.epsteinandroid.activities;

import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.content.ContentUris;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.RectF;
import android.net.Uri;
import android.provider.CalendarContract;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.ListView;
import android.widget.Toast;

import com.alamkanak.weekview.MonthLoader;
import com.alamkanak.weekview.WeekView;
import com.alamkanak.weekview.WeekViewEvent;
import com.rarepebble.colorpicker.ColorPickerView;

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
    public static final int UPDATED_STRESS_LEVELS = 282;

    private boolean hasLaunchedCalendar = false;
    private boolean hasUpdatedCalendar = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        ButterKnife.bind(this);

        weekView.setOnEventClickListener(this);
        weekView.setMonthChangeListener(this);

        weekView.setDayBackgroundColor(SharedPrefsHelper.getSharedPrefs(this).getInt("backgroundColor", Color.WHITE));
        weekView.setEventTextColor(SharedPrefsHelper.getSharedPrefs(this).getInt("textColor", Color.WHITE));

        getCalendarDataAndUpdateUi();
    }

    @Override
    public void onResume() {
        super.onResume();
        if (!hasLaunchedCalendar && hasUpdatedCalendar) {
            getCalendarDataAndUpdateUi();
        }
        if (hasLaunchedCalendar) {
            hasLaunchedCalendar = false;
        }
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
                startActivityForResult(i, UPDATED_STRESS_LEVELS);
                break;
            case R.id.suggest_reschedule:
                suggestEvents();
                break;
            case R.id.background_picker:
                pickBackgroundColor();
                break;
            case R.id.font_color:
                pickTextColor();
                break;
            default:
                //Nothing
        }

        return true;
    }

    private void suggestEvents() {
        EpsteinApiHelper.getInstance().getEventsToRescheduleSuggestions(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null)
        ).enqueue(new Callback<Events>() {
            @Override
            public void onResponse(Call<Events> call, Response<Events> response) {
                if (response.code() == 200 && response.body() != null) {
                    List<String> eventTitles = new ArrayList<>();
                    for (Event e : response.body().items) {
                        eventTitles.add(e.summary);
                    }

                    ListView lv = new ListView(CalendarActivity.this);
                    lv.setAdapter(new ArrayAdapter<>(CalendarActivity.this, android.R.layout.simple_list_item_1, eventTitles));

                    android.app.AlertDialog.Builder alert = new android.app.AlertDialog.Builder(CalendarActivity.this)
                            .setTitle("Suggested Events")
                            .setView(lv)
                            .setNegativeButton("Okay", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.dismiss();
                                    finish();
                                }
                            });
                    alert.show();
                }
            }

            @Override
            public void onFailure(Call<Events> call, Throwable t) {
                System.out.println("failed");
            }
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == IMPORTED_CALENDAR || requestCode == UPDATED_STRESS_LEVELS) {
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

            setCalendarEventColor(calendarEventToAdd, event);

            calendarEventToAdd.setIdentifier(event.htmlLink);

            events.add(calendarEventToAdd);
        }

        return events;
    }

    private void setCalendarEventColor(WeekViewEvent calendarEventToAdd, Event event) {
        switch (event.stressValue) {
            case -10:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative10));
                break;
            case -9:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative9));
                break;
            case -8:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative8));
                break;
            case -7:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative7));
                break;
            case -6:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative6));
                break;
            case -5:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative5));
                break;
            case -4:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative4));
                break;
            case -3:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative3));
                break;
            case -2:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative2));
                break;
            case -1:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorNegative1));
                break;
            case 0:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorZeroStressLevel));
                break;
            case 1:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive1));
                break;
            case 2:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive2));
                break;
            case 3:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive3));
                break;
            case 4:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive4));
                break;
            case 5:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive5));
                break;
            case 6:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive6));
                break;
            case 7:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive7));
                break;
            case 8:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive8));
                break;
            case 9:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive9));
                break;
            case 10:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorPositive10));
                break;
            default:
                calendarEventToAdd.setColor(getResources().getColor(R.color.colorUnrated));
                break;
        }
    }

    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month, dayOfMonth);
        weekView.goToDate(calendar);
    }

    @Override
    public void onEventClick(WeekViewEvent event, RectF eventRect) {
        System.out.println(event.getIdentifier());
        Intent calIntent = new Intent(Intent.ACTION_VIEW)
                .setType("vnd.android.cursor.item/event")
                .setData(Uri.parse(event.getIdentifier()))
                .putExtra(CalendarContract.Events._ID, event.getIdentifier());
        calIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        hasLaunchedCalendar = true;
        hasUpdatedCalendar = true;
        startActivity(calIntent);
    }

    private void pickBackgroundColor() {
        final ColorPickerView picker = new ColorPickerView(this);
        picker.setColor(Color.GRAY);
        android.app.AlertDialog.Builder alert = new android.app.AlertDialog.Builder(this)
                .setTitle("Pick color")
                .setView(picker)
                .setPositiveButton("Done", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        SharedPrefsHelper.getSharedPrefs(CalendarActivity.this).edit().putInt("backgroundColor", picker.getColor()).apply();
                        weekView.setDayBackgroundColor(picker.getColor());
                        dialog.dismiss();
                    }
                });
        alert.show();
    }

    private void pickTextColor() {
        final ColorPickerView picker = new ColorPickerView(this);
        picker.setColor(Color.GRAY);
        android.app.AlertDialog.Builder alert = new android.app.AlertDialog.Builder(this)
                .setTitle("Pick color")
                .setView(picker)
                .setPositiveButton("Done", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        SharedPrefsHelper.getSharedPrefs(CalendarActivity.this).edit().putInt("textColor", picker.getColor()).apply();
                        weekView.setEventTextColor(picker.getColor());
                        dialog.dismiss();
                    }
                });
        alert.show();
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
