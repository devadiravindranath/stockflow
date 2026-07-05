const organizationRepository = require('../repositories/organization.repository');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

class OrganizationService {
  async createOrganization(name, userId) {
    if (!name) {
      throw new ApiError(400, 'Organization name is required');
    }

    // Check if the user already belongs to an organization
    const user = userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    if (user.organization_id) {
      throw new ApiError(409, 'User already belongs to an organization');
    }

    // Generate a unique slug from the name
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    
    // Ensure slug is unique
    let counter = 1;
    while (await organizationRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the organization
    const organization = await organizationRepository.create({ name, slug });

    // Assign the user to the new organization
    await userRepository.updateOrganization(userId, organization.id);

    return organization;
  }

  async getMyOrganization(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (!user.organization_id) {
      throw new ApiError(404, 'User does not belong to any organization');
    }

    const organization = await organizationRepository.findById(user.organization_id);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    return organization;
  }
}

module.exports = new OrganizationService();
