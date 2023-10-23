package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.math.MathUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class WeightedChoiceSelector<T> {

    private final List<T> options;
    private final Function<T, Float> weightFunction;


    public WeightedChoiceSelector(final Function<T, Float> weightFunction) {
        this.options = new ArrayList<>();
        this.weightFunction = weightFunction;
    }

    public void addItem(final T item) {
        this.options.add(item);
    }

    private float weightSum() {
        float sum = 0f;
        for (final T item : this.options) {
            sum += this.weightFunction.apply(item);
        }
        return sum;
    }

    public T select() {
        final float sum = weightSum();
        float r = MathUtils.random(sum);
        for (final T item : this.options) {
            r -= this.weightFunction.apply(item);
            if (r <= 0f) {
                return item;
            }
        }
        throw new IllegalStateException("WeightedChoiceSelector.select() failed");
    }

}
