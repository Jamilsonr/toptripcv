<?php

namespace App\Services;

use App\Models\Holiday;
use Carbon\CarbonImmutable;

class BusinessDayCalculator
{
    public function countBusinessDays(CarbonImmutable $start, CarbonImmutable $end): int
    {
        if ($end->lessThan($start)) {
            return 0;
        }

        $holidayDates = Holiday::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->pluck('date')
            ->map(fn ($d) => CarbonImmutable::parse($d)->toDateString())
            ->all();

        $holidays = array_fill_keys($holidayDates, true);

        $days = 0;
        for ($date = $start; $date->lessThanOrEqualTo($end); $date = $date->addDay()) {
            if (!$date->isWeekday()) {
                continue;
            }

            if (isset($holidays[$date->toDateString()])) {
                continue;
            }

            $days++;
        }

        return $days;
    }
}

