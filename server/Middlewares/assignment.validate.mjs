export const validationAssignment = (req, res, next) => {
  const { title, content, category, email } = req.body;
  const errors = [];
  if (!title) {
    errors.push('Title is required');
  }

  if (!content) {
    errors.push('Content is required');
  } else {
    const contentLength = content.length;
    if (contentLength < 500 || contentLength > 1000) {
      errors.push('Content must be between 500 and 1000 characters');
    }
  }

  const allowedCategories = ['Math', 'English', 'Biology'];
  if (!category) {
    errors.push('Category is required');
  } else if (!allowedCategories.includes(category)) {
    errors.push('Category must be Math, English, or Biology');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailPattern.test(email)) {
    errors.push('Email must be a valid email format');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

export default validationAssignment;
