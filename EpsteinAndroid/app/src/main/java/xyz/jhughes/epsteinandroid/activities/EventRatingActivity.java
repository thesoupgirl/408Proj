package xyz.jhughes.epsteinandroid.activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import xyz.jhughes.epsteinandroid.R;
import xyz.jhughes.epsteinandroid.adapters.EventRatingAdapter;
import xyz.jhughes.epsteinandroid.models.Events.Event;
import xyz.jhughes.epsteinandroid.models.Events.Events;
import xyz.jhughes.epsteinandroid.models.Events.RateEvent;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class EventRatingActivity extends AppCompatActivity {

    @BindView(R.id.recycler_view)
    RecyclerView recyclerView;

    private EventRatingAdapter adapter;

    private int toPost = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_rating);

        ButterKnife.bind(this);

        Events eventsUnfiltered;
        try {
            eventsUnfiltered = (Events) getIntent().getExtras().getSerializable("events");
        } catch (Exception e) {
            Toast.makeText(this, "An error occured", Toast.LENGTH_LONG).show();
            return;
        }

        if (eventsUnfiltered == null) {
            Toast.makeText(this, "An error occured", Toast.LENGTH_LONG).show();
            return;
        }

        List<Event> events = removeRecurringAndDupes(eventsUnfiltered.items);

        initRecyclerView(events);
    }

    private List<Event> removeRecurringAndDupes(List<Event> eventsUnfiltered) {
        List<Event> events = new ArrayList<>();

        List<String> eventsThatHaveOccured = new ArrayList<>();

        for (Event e : eventsUnfiltered) {
            if (eventsThatHaveOccured.contains(e.recurringEventId)) {
                continue;
            }
            events.add(e);
            eventsThatHaveOccured.add(e.recurringEventId);
        }

        return events;
    }

    private void initRecyclerView(List<Event> events) {
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);

        adapter = new EventRatingAdapter(events, this);

        recyclerView.setAdapter(adapter);
    }

    @OnClick(R.id.submit_ratings_button)
    public void submitEventRatings() {
        String email = SharedPrefsHelper.getSharedPrefs(this).getString("email", null);
        String idToken = SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null);

        toPost = adapter.mDataset.size();

        for (Event event : adapter.mDataset) {
            RateEvent model = new RateEvent();
            model.userName = email;
            model.idToken = idToken;
            model.calEvent = event.id;
            model.stressValue = Integer.toString(event.stressValue);

            EpsteinApiHelper.getInstance().updateStreeEvent(model).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.code() != 200) {
                        Toast.makeText(EventRatingActivity.this, "Failed to update stress levels", Toast.LENGTH_LONG).show();
                    }
                    toPost--;
                    if (toPost <= 0) {
                        Toast.makeText(EventRatingActivity.this, "Stress levels updated!", Toast.LENGTH_LONG).show();
                        finish();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(EventRatingActivity.this, "Failed to update stress levels", Toast.LENGTH_LONG).show();
                }
            });
        }
    }
}
