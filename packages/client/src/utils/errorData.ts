/**
 * @description Преобразует объект класса Error в структуру с поддержкой сериализации
 */
export const errorData = (error: Error): Record<string, unknown> => {
  const propertyNames = Object.getOwnPropertyNames(error);
  const result: Record<string, unknown> = {};
  propertyNames.forEach((property) => {
    const descriptor = Object.getOwnPropertyDescriptor(error, property);
    if (descriptor && 'value' in descriptor) {
      result[property] = descriptor.value as unknown;
    }
  })
  return result;
};

export default errorData;
