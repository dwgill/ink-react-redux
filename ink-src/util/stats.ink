CONST HARD = "HARD"
CONST SOFT = "SOFT"
CONST HOT = "HOT"
CONST COOL = "COOL"
CONST CONTROL = "CONTROL"


LIST hard_list = (neg_two), (neg_one), (zero), (one), (two)
LIST soft_list = (neg_two), (neg_one), (zero), (one), (two)
LIST hot_list = (neg_two), (neg_one), (zero), (one), (two)
LIST cool_list = (neg_two), (neg_one), (zero), (one), (two)
LIST control_list = (neg_two), (neg_one), (zero), (one), (two)

    
=== function posNegSign(num)
    {num < 0:
        ~ return "-"
    - else:
        ~ return "+"
    }

=== function statList(stat_id)
    {stat_id:
    - HARD:
        ~ return hard_list
    - SOFT:
        ~ return soft_list
    - HOT:
        ~ return hot_list
    - COOL:
        ~ return cool_list
    - CONTROL:
        ~ return control_list
    - else:
        ~ return control_list
     }
     
=== function statName(stat_id)
    {stat_id:
    - HARD:
        ~ return "Hard"
    - SOFT:
        ~ return "Soft"
    - HOT:
        ~ return "Hot"
    - COOL:
        ~ return "Cool"
    - CONTROL:
        ~ return "Control"
    - else:
        ~ return "?UnknownStat?"
     }

=== function statVal(char, stat_id)
    // The stats range -2, -1, 0, 1, 2
    // But lists start counting from 1, so we adjust
    ~ temp raw_stat_val = LIST_VALUE(char ^ statList(stat_id)) - 3
    {stat_id == COMPOSURE:
        ~ return -raw_stat_val
    }
    ~ return raw_stat_val

=== function statStr(char, stat_id)
    ~ temp val = statVal(char, stat_id)
    {val < 0:
        ~ return "{val}"
    - else:
        ~ return "+{val}"
    }
    
=== function rollStat(char, stat_id)
    ~ temp dice_1 = d6()
    ~ temp dice_2 = d6()
    ~ temp stat_val = statVal(char, stat_id)
    ~ temp result = dice_1 + dice_2 + stat_val
    ~ temp outcome = evalOutcome(result)
    ~ temp outcome_name = outcomeName(outcome)
    {not DEBUG:
        ~ return outcome
    }
    Rolled {statName(stat_id)} ➡ ({dice_1} + {dice_2}) {posNegSign(stat_val)} {absNum(stat_val)} = {result} ➡ {outcome_name}
    ~ return outcome
