const supabase = require('../config/supabase');

exports.createBundle = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const { data, error } = await supabase
      .from('bundles')
      .insert([{
        user_id: req.user.id,
        name,
        description,
        color: color || '#6c63ff'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBundles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bundles')
      .select('*, links(count)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.moveLinkToBundle = async (req, res) => {
  try {
    const { linkId, bundleId } = req.body;
    const { data, error } = await supabase
      .from('links')
      .update({ bundle_id: bundleId })
      .eq('id', linkId)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('bundles').delete().eq('id', id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ message: 'Bundle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
