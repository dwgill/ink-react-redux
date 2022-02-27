

LIST outcome_list = failure, mixed_success, hard_success


=== function evalOutcome(dice_roll_num)
    {
    - dice_roll_num < 7:
        ~ return outcome_list.failure
    - dice_roll_num < 10:
        ~ return outcome_list.mixed_success
    - else:
        ~ return outcome_list.hard_success
    }
    
=== function outcomeName(outcome)
    {outcome:
    - outcome_list.failure:
        ~ return "Hard Success"
    - outcome_list.mixed_success:
        ~ return "Mixed Success"
    - else:
        ~ return "Hard Success"
    }