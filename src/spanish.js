const spanish = {
  // 1) \xA0 = &nbsp;                      1___
  initialMessage: 'Calculadora de tiempo de\xA0curación.',
  initialMonth: '1',
  initialYear: (() => {
    let currYear = new Date()
    let result = currYear.getFullYear() - 2
    result = String(result)
    result = result.substring(2, 4)
    return result })(),
  validationSuccess: '✓ Ok',
  // ERRORS.  1) \xA0 = &nbsp;                   1___
  validationError: '✗ Incorrecto' ,
  defaultError:   'Error, por favor, inténtalo de\xA0nuevo.',
  futureError:    'Error, por favor, inténtalo de\xA0nuevo.'
}

export default spanish
