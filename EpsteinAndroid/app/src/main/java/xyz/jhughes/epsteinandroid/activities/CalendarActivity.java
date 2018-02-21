package xyz.jhughes.epsteinandroid.activities;

import android.app.ProgressDialog;
import android.graphics.RectF;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
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
import xyz.jhughes.epsteinandroid.models.Events.Events;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class CalendarActivity extends AppCompatActivity implements WeekView.EventClickListener, MonthLoader.MonthChangeListener{

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

    protected String getEventTitle(Calendar time) {
        return String.format("Event of %02d:%02d %s/%d", time.get(Calendar.HOUR_OF_DAY), time.get(Calendar.MINUTE), time.get(Calendar.MONTH) + 1, time.get(Calendar.DAY_OF_MONTH));
    }

    @Override
    public List<? extends WeekViewEvent> onMonthChange(int newYear, int newMonth) {


        // Populate the week view with some events.
        List<WeekViewEvent> events = new ArrayList<WeekViewEvent>();

        if (this.events == null) {
            Toast.makeText(this, "Looks like you don't have anything! Stress free!", Toast.LENGTH_LONG).show();

            return events;
        }

        Calendar startTime = Calendar.getInstance();
        startTime.set(Calendar.HOUR_OF_DAY, 3);
        startTime.set(Calendar.MINUTE, 0);
        startTime.set(Calendar.MONTH, newMonth - 1);
        startTime.set(Calendar.YEAR, newYear);
        Calendar endTime = (Calendar) startTime.clone();
        endTime.add(Calendar.HOUR, 1);
        endTime.set(Calendar.MONTH, newMonth - 1);
        WeekViewEvent event = new WeekViewEvent("First", getEventTitle(startTime), startTime, endTime);
        event.setColor(getResources().getColor(R.color.colorPrimary));
        events.add(event);

        return events;
    }

    @Override
    public void onEventClick(WeekViewEvent event, RectF eventRect) {

    }
}
