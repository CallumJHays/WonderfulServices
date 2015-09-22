$(function () {
    $('#btnAdd_1').click(function () {
        var num     = $('.clonedInput_1').length, // Checks to see how many "duplicatable" input fields we currently have
            newNum  = new Number(num + 1),      // The numeric ID of the new input field being added, increasing by 1 each time
            newElem = $('#vehicle' + num).clone().attr('id', 'vehicle' + newNum).fadeIn('slow'); // create the new element via clone(), and manipulate it's ID using newNum value
    
    /*  This is where we manipulate the name/id values of the input inside the new, cloned element
        Below are examples of what forms elements you can clone, but not the only ones.
        There are 2 basic structures below: one for an H2, and one for form elements.
        To make more, you can copy the one for form elements and simply update the classes for its label and input.
        Keep in mind that the .val() method is what clears the element when it gets cloned. Radio and checkboxes need .val([]) instead of .val('').
    */
    // Insert the new element after the last "duplicatable" input field
        $('#vehicle' + num).after(newElem);
        $('#ID' + newNum + '_title').focus();

    // Enable the "remove" button. This only shows once you have a duplicated section.
        $('#btnDel_1').attr('disabled', false);

    // Right now you can only add 4 sections, for a total of 5. Change '5' below to the max number of sections you want to allow.
        // This first if statement is for forms using input type="button" (see older demo). Delete if using button element.
        if (newNum == 5)
        $('#btnAdd_1').attr('disabled', true).prop('value', "You've reached the limit"); // value here updates the text in the 'add' button when the limit is reached
        // This second if statement is for forms using the new button tag (see Bootstrap demo). Delete if using input type="button" element.
        if (newNum == 5)
        $('#btnAdd_1').attr('disabled', true).text("You can only wash a maximum of 5 cars per appointment"); // value here updates the text in the 'add' button when the limit is reached 
    });

    $('#btnDel_1').click(function () {
    // Confirmation dialog box. Works on all desktop browsers and iPhone.
        if (confirm("Are you sure you wish to remove this vehicle? This cannot be undone."))
            {
                var num = $('.clonedInput_1').length;
                // how many "duplicatable" input fields we currently have
                $('#vehicle' + num).slideUp('slow', function () {$(this).remove();
                // if only one element remains, disable the "remove" button
                    if (num -1 === 1)
                $('#btnDel_1').attr('disabled', true);
                // enable the "add" button. IMPORTANT: only for forms using input type="button" (see older demo). DELETE if using button element.
                $('#btnAdd_1').attr('disabled', false).prop('value', "Add vehicle");
                // enable the "add" button. IMPORTANT: only for forms using the new button tag (see Bootstrap demo). DELETE if using input type="button" element.
                $('#btnAdd_1').attr('disabled', false).text("Add vehicle");});
            }
        return false; // Removes the last section you added
    });
    // Enable the "add" button
    $('#btnAdd_1').attr('disabled', false);
    // Disable the "remove" button
    $('#btnDel_1').attr('disabled', true);
});